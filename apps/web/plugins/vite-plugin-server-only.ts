import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Plugin } from 'vite'

/** Options for {@link serverOnlyGuard}. */
export interface ServerOnlyGuardOptions {
  /**
   * Directories whose modules are server-only. Relative paths are resolved
   * against {@link ServerOnlyGuardOptions.resolveFrom}.
   */
  roots?: readonly string[]
  /**
   * Server-only package specifiers, each resolved to its package root via its
   * `./package.json` export (pnpm-symlink safe).
   */
  packages?: readonly string[]
  /**
   * Module URL used to resolve `packages` and relative `roots`. Pass
   * `import.meta.url` from the Vite config.
   */
  resolveFrom: string
}

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
 * Resolve a path to its absolute, symlink-resolved form (pnpm-safe).
 * @param target - The path to resolve.
 * @returns The symlink-resolved absolute path.
 */
function realPath(target: string): string {
  try {
    return fs.realpathSync(target)
  } catch {
    return path.resolve(target)
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
 * @param options - Server-only roots/packages and the resolution base.
 * @returns The configured Vite plugin.
 */
export function serverOnlyGuard(options: ServerOnlyGuardOptions): Plugin {
  const require = createRequire(options.resolveFrom)
  const base = path.dirname(fileURLToPath(options.resolveFrom))

  // Guarded roots: explicit directories plus each server-only package's root.
  // The package must expose `./package.json` in its exports for this to resolve.
  // Resolution is tolerant: a package that is not resolvable from this graph
  // cannot be imported anyway, so it is skipped now and guarded automatically
  // the moment it becomes resolvable (e.g. if it is later added as a dependency).
  const guardedRoots = [
    ...(options.roots ?? []).map((root) => realPath(path.resolve(base, root))),
    ...(options.packages ?? []).flatMap((pkg) => {
      try {
        return [realPath(path.dirname(require.resolve(`${pkg}/package.json`)))]
      } catch {
        return []
      }
    }),
  ]

  return {
    name: 'server-only-guard',
    enforce: 'pre',
    load(id, hookOptions) {
      // Allow server-side environments (future SSR/server build target).
      const isServerConsumer =
        this.environment.config.consumer === 'server' ||
        hookOptions?.ssr === true
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
          `(e.g. \`import type { router } from '@template/api'\`). A value ` +
          `import leaks server code into the browser bundle. Guarded roots:\n` +
          guardedRoots.map((root) => `  - ${root}`).join('\n'),
      )
    },
  }
}
