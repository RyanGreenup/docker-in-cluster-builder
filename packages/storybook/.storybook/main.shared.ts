import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { mergeConfig, type InlineConfig } from "vite";

import type { StorybookConfig } from "storybook-solidjs-vite";

const abs = (value: string) =>
  dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));

/**
 * Shared `viteFinal` for every @rs storybook. The workspace UI packages are
 * consumed as raw TSX/CSS source (their package.json `exports` resolve to `src`
 * via the `@rs/source` condition), so the dev/build Vite config must:
 *
 *  - register `vanilla-extract` so the design `.css.ts` recipes compile;
 *  - resolve the `@rs/source` export condition;
 *  - dedupe solid-js to a single instance (source consumption pulls a second
 *    copy through the workspace package path alongside the renderer's);
 *  - exclude the source packages from dep pre-bundling. esbuild honours each
 *    package's tsconfig `jsx: "preserve"` and would leave JSX in place, so the
 *    files must flow through `vite-plugin-solid` instead of the optimizer.
 *
 * Pass the @rs workspace packages this storybook consumes as source. Excluding
 * a package that is not in the graph is a harmless no-op.
 */
export const makeViteFinal =
  (sourcePackages: readonly string[] = []) =>
  (config: InlineConfig): InlineConfig =>
    mergeConfig(config, {
      plugins: [vanillaExtractPlugin()],
      resolve: {
        conditions: ["@rs/source"],
        dedupe: ["solid-js", "solid-js/web", "solid-js/store"],
      },
      optimizeDeps: {
        exclude: [...sourcePackages],
      },
    });

export const baseAddons = [
  abs("@chromatic-com/storybook"),
  abs("@storybook/addon-vitest"),
  abs("@storybook/addon-a11y"),
  abs("@storybook/addon-docs"),
];

export const baseConfig: Partial<StorybookConfig> = {
  addons: baseAddons,
  framework: "storybook-solidjs-vite",
};

export const baseStoriesDir =
  dirname(
    fileURLToPath(import.meta.resolve("@rs/storybook/package.json")),
  ) + "/src";
