import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { playwright } from "@vitest/browser-playwright";
import solidPlugin from "vite-plugin-solid";
import { defineConfig, type ViteUserConfig } from "vitest/config";

/**
 * Real-browser Playwright tests for primitives that jsdom cannot exercise,
 * including focus trapping, Escape or outside-pointer dismissal, and portals.
 *
 * This config stays separate from the jsdom suite in `vitest.config.ts` so the
 * two suites do not collide. It only matches `*.browser.test.tsx` under `src/`.
 *
 * The `as unknown as ViteUserConfig` cast works around pnpm resolving two
 * structurally distinct copies of Vitest config types. One comes through
 * `@vitest/browser-playwright`, so the `playwright()` provider and the literal
 * `browser` instance do not line up with the local `ViteUserConfig`. This uses
 * the same type-clash workaround as the jsdom config.
 */
const config = {
  plugins: [vanillaExtractPlugin(), solidPlugin()],
  resolve: {
    alias: { tslib: "tslib/tslib.es6.js" },
  },
  test: {
    browser: {
      enabled: true,
      headless: true,
      instances: [{ browser: "chromium" }],
      provider: playwright(),
    },
    include: ["src/**/*.browser.test.{ts,tsx}"],
  },
} as unknown as ViteUserConfig;

export default defineConfig(config);
