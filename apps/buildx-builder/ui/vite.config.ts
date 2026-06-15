import { defineConfig } from 'vite'

import { devtools } from '@tanstack/devtools-vite'

import { tanstackRouter } from '@tanstack/router-plugin/vite'

import solidPlugin from 'vite-plugin-solid'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'

import { serverOnlyGuard } from './plugins/vite-plugin-server-only'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  // These packages ship `.css.ts` source. Exclude them so Vite's dep optimizer
  // doesn't pre-bundle them past vanillaExtractPlugin (which would throw at
  // runtime). See each package's README.
  optimizeDeps: { exclude: ['@rs/ryan-personal-website-design', '@rs/layout'] },
  plugins: [
    // Runs first (enforce: 'pre') so it throws before any guarded file is read.
    // `@server/*` modules and the oRPC server package are reachable by
    // `import type` only; a value import fails the build.
    serverOnlyGuard({
      resolveFrom: import.meta.url,
      roots: ['./src/server'],
      // `@rs/buildx-builder-lib` is not a declared UI dependency today, so it is
      // not resolvable and the guard skips it; listing it means it is blocked
      // automatically if it ever becomes reachable (it spawns docker buildx).
      packages: ['@rs/buildx-builder-api', '@rs/buildx-builder-lib'],
    }),
    devtools(),
    tanstackRouter({ target: 'solid', autoCodeSplitting: true }),
    solidPlugin(),
    // Compiles the design package's `.css.ts` recipes (e.g. the button recipe
    // from @rs/ryan-personal-website-design) into static CSS at build time.
    vanillaExtractPlugin(),
  ],
})
