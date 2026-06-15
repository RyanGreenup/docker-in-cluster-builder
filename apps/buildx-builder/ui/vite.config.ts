import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackRouter } from '@tanstack/router-plugin/vite'

import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tanstackRouter({ target: 'solid', autoCodeSplitting: true }),
    solidPlugin(),
  ],
})
