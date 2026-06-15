import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import solidPlugin from "vite-plugin-solid";
import { defineConfig, type ViteUserConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
  // to test in server environment, run with "--mode ssr" or "--mode test:ssr" flag
  // loads only server.test.ts file
  const testSSR = mode === "test:ssr" || mode === "ssr";

  // `as ViteUserConfig`: vite augments the global NodeJS.ProcessEnv with boolean
  // import.meta.env keys (DEV/PROD/SSR), which conflicts with @types/node's string
  // ProcessEnv through vitest's defineConfig overloads — no env value satisfies both.
  // Env vars are strings at runtime, so we keep strings and cast past the type clash.
  return {
    plugins: [
      solidPlugin({
        // https://github.com/solidjs/solid-refresh/issues/29
        hot: false,
        // For testing SSR we need to do a SSR JSX transform
        solid: { generate: testSSR ? "ssr" : "dom" },
      }),
      // Required so `.css.ts` imports (pulled in via the package barrel) can be
      // transformed during tests; otherwise vanilla-extract throws getFileScope.
      vanillaExtractPlugin(),
    ],
    test: {
      watch: false,
      // Suppress vite-plugin-solid's broken auto-injection of jest-dom (it
      // resolves the specifier from its own pnpm dir, but vitest then can't
      // resolve it from this package root). The plugin skips injection when an
      // existing setupFile path matches /jest-dom/.
      setupFiles: testSSR ? [] : ["./test/setup.jest-dom.ts"],
      isolate: !testSSR,
      env: {
        NODE_ENV: testSSR ? "production" : "development",
        DEV: testSSR ? "" : "1",
        SSR: testSSR ? "1" : "",
        PROD: testSSR ? "1" : "",
      },
      environment: testSSR ? "node" : "jsdom",
      transformMode: { web: [/\.[jt]sx$/] },
      include: testSSR ? ["test/server.test.{ts,tsx}"] : ["test/*.test.{ts,tsx}"],
      exclude: testSSR ? [] : ["test/server.test.{ts,tsx}"],
    },
    resolve: {
      conditions: testSSR ? ["node"] : ["browser", "development"],
    },
  } as unknown as ViteUserConfig;
});
