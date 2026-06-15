import { storybookViteConfig } from "@rs/storybook/vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
/// <reference types="vitest/config" />
import { defineConfig } from "vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(
  storybookViteConfig(path.join(dirname, ".storybook")),
);
