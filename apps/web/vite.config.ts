import { defineConfig } from 'vite'

import { devtools } from '@tanstack/devtools-vite'

import { tanstackRouter } from '@tanstack/router-plugin/vite'

import solidPlugin from 'vite-plugin-solid'

import { serverOnlyGuard } from './plugins/vite-plugin-server-only'

const API_PROXY_TARGET =
  process.env.VITE_DEV_API_PROXY_TARGET ?? 'http://127.0.0.1:3001'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  server: {
    proxy: { '/rpc': API_PROXY_TARGET },
  },
  plugins: [
    // Runs first (enforce: 'pre') so it throws before any guarded file is read.
    // `@server/*` modules and the oRPC server package are reachable by
    // `import type` only; a value import fails the build.
    serverOnlyGuard({
      resolveFrom: import.meta.url,
      roots: ['./src/server'],
      packages: ['@template/api'],
    }),
    devtools(),
    tanstackRouter({ target: 'solid', autoCodeSplitting: true }),
    solidPlugin(),
  ],
})
