import { defineConfig } from 'vite'

import { devtools } from '@tanstack/devtools-vite'

import { tanstackRouter } from '@tanstack/router-plugin/vite'

import solidPlugin from 'vite-plugin-solid'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  // These packages ship `.css.ts` source. Exclude them so Vite's dep optimizer
  // doesn't pre-bundle them past vanillaExtractPlugin (which would throw at
  // runtime). See each package's README.
  optimizeDeps: { exclude: ['@rs/ryan-personal-website-design', '@rs/layout'] },
  plugins: [
    devtools(),
    tanstackRouter({ target: 'solid', autoCodeSplitting: true }),
    solidPlugin(),
    // Compiles the design package's `.css.ts` recipes (e.g. the button recipe
    // from @rs/ryan-personal-website-design) into static CSS at build time.
    vanillaExtractPlugin(),
  ],
})
