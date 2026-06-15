import path from "node:path";
import { fileURLToPath } from "node:url";
/// <reference types="vitest/config" />
import { defineConfig } from "vite";

import { storybookViteConfig } from "./vite.shared";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  server: {
    port: 3000,
  },
  ...storybookViteConfig(path.join(dirname, ".storybook")),
});
