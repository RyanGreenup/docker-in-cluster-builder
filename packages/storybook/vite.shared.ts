import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { playwright } from "@vitest/browser-playwright";
import devtools from "solid-devtools/vite";
import solidPlugin from "vite-plugin-solid";

export const storybookViteConfig = (configDir: string) => ({
  plugins: [vanillaExtractPlugin(), devtools(), solidPlugin()],
  build: {
    target: "esnext",
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir })],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
