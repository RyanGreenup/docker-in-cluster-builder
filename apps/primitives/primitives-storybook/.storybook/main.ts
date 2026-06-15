import { baseConfig, baseStoriesDir, makeViteFinal } from "@rs/storybook/main";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "storybook-solidjs-vite";

const appSrc = dirname(fileURLToPath(import.meta.url)) + "/../src";
const layoutSrc = dirname(fileURLToPath(import.meta.url)) + "/../../../packages/layout/src";

// Workspace-package source dirs whose components should get docgen prop tables.
// Add each component-library package's src here (also add it to tsconfig.json's
// `include` so the files land in the TypeScript program docgen builds from).
const docgenSourceDirs = [appSrc, baseStoriesDir, layoutSrc];

const config: StorybookConfig = {
  ...baseConfig,
  framework: {
    name: "storybook-solidjs-vite",
    options: {
      docgen: {
        include: docgenSourceDirs.map((dir) => `${dir}/**/*.tsx`),
        exclude: ["**/*.stories.tsx"],
      },
    },
  },
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    {
      directory: baseStoriesDir,
      titlePrefix: "Base Examples",
      files: "**/*.@(mdx|stories.@(js|jsx|mjs|ts|tsx))",
    },
  ],
  // Compile the layout + solid-primitives packages from source (vanilla-extract
  // recipes + solid JSX), skipping dep pre-bundling so vite-plugin-solid handles
  // them instead of esbuild (which would honour their tsconfig jsx: preserve).
  viteFinal: makeViteFinal(["@rs/layout", "@rs/solid-primitives"]),
};

export default config;
