import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import type { Plugin } from 'vite'

import { devtools } from '@tanstack/devtools-vite'

import { tanstackRouter } from '@tanstack/router-plugin/vite'

import solidPlugin from 'vite-plugin-solid'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'

const here = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

/**
 * Normalize a module id to an absolute, symlink-resolved path with no query/hash.
 * @param id - The module id to normalize.
 * @returns The cleaned, symlink-resolved absolute path.
 */
function normalizeId(id: string): string {
  const clean = id.replace(/[?#].*$/, '')
  try {
    return fs.realpathSync(clean)
  } catch {
    return clean
  }
}

/**
 * Resolve a directory to its absolute, symlink-resolved form (pnpm-safe).
 * @param dir - The directory path to resolve.
 * @returns The symlink-resolved absolute directory path.
 */
function realDir(dir: string): string {
  try {
    return fs.realpathSync(dir)
  } catch {
    return path.resolve(dir)
  }
}

/**
 * Prohibit non-type imports of server-only modules from the client bundle.
 *
 * The guard works at the module-graph level, not on import syntax, so it cannot
 * be evaded by re-exports, `export *`, aliased specifiers, or dynamic imports.
 * With `verbatimModuleSyntax` (tsconfig), `import type` / `export type` are
 * erased before Vite resolves the target, so a type-only consumer never loads a
 * guarded module. Any value import does physically load it, no matter how
 * indirect the path, and trips this `load` hook. This is the local equivalent
 * of the `server-only` package for an SPA that has no server/browser export
 * conditions.
 *
 * Only the client graph is blocked; a future SSR/server build (consumer
 * `'server'`) may legitimately bundle these modules.
 *
 * NOTE the use of verbatimModuleSyntax has issues with Tanstack Start.
 *
 * @returns the serverOnlyGuard plugin for vite
 */
function serverOnlyGuard(): Plugin {
  // Guarded roots: the local `@server` dir and the oRPC server package source.
  // The package exposes `./package.json` in its exports, so this resolves even
  // through pnpm symlinks; dirname gives the package root (covers its `src`).
  const guardedRoots = [
    realDir(path.join(here, 'src/server')),
    realDir(
      path.dirname(require.resolve('@rs/buildx-builder-api/package.json')),
    ),
  ]

  return {
    name: 'server-only-guard',
    enforce: 'pre',
    load(id, options) {
      // Allow server-side environments (future SSR/server build target).
      const isServerConsumer =
        this.environment.config.consumer === 'server' || options?.ssr === true
      if (isServerConsumer) {
        return
      }

      const file = normalizeId(id)
      const isGuarded = guardedRoots.some(
        (root) => file === root || file.startsWith(root + path.sep),
      )
      if (!isGuarded) {
        return
      }

      this.error(
        `Server-only module loaded into the client bundle: ${file}\n` +
          `Modules under a server-only root may be imported with \`import type\` only ` +
          `(e.g. \`import type { router } from '@rs/buildx-builder-api'\`). A value ` +
          `import leaks server code into the browser bundle. Guarded roots:\n` +
          guardedRoots.map((root) => `  - ${root}`).join('\n'),
      )
    },
  }
}

export default defineConfig({
  resolve: { tsconfigPaths: true },
  // These packages ship `.css.ts` source. Exclude them so Vite's dep optimizer
  // doesn't pre-bundle them past vanillaExtractPlugin (which would throw at
  // runtime). See each package's README.
  optimizeDeps: { exclude: ['@rs/ryan-personal-website-design', '@rs/layout'] },
  plugins: [
    // Runs first (enforce: 'pre') so it throws before any guarded file is read.
    serverOnlyGuard(),
    devtools(),
    tanstackRouter({ target: 'solid', autoCodeSplitting: true }),
    solidPlugin(),
    // Compiles the design package's `.css.ts` recipes (e.g. the button recipe
    // from @rs/ryan-personal-website-design) into static CSS at build time.
    vanillaExtractPlugin(),
  ],
})
