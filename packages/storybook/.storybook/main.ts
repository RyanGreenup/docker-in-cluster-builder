import { baseConfig } from "@rs/storybook/main";

import type { StorybookConfig } from "storybook-solidjs-vite";

const config: StorybookConfig = {
  ...baseConfig,
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
};

export default config;
