import { vanillaExtractPlugin } from "@vanilla-extract/rollup-plugin";
import { defineConfig, type UserConfig } from "tsdown";
import solid from "vite-plugin-solid";

const base = {
  entry: ["src/index.tsx", "src/exemplars/index.tsx"],
  platform: "neutral",
  sourcemap: true,
} satisfies Partial<UserConfig>;

export default defineConfig([
  // Client build: hydratable DOM output (resolved via `browser`/`import`).
  {
    ...base,
    clean: true,
    dts: true,
    plugins: [vanillaExtractPlugin(), solid({ solid: { generate: "dom", hydratable: true } })],
  },
  // Server build: SSR output (resolved via `node`).
  {
    ...base,
    clean: false,
    dts: false,
    outDir: "dist/server",
    plugins: [vanillaExtractPlugin(), solid({ solid: { generate: "ssr", hydratable: true } })],
  },
]);
