import { baseConfig } from "@rs/oxlint-config/base";
import { jsdocConfig } from "@rs/oxlint-config/jsdoc";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [baseConfig, jsdocConfig],
  rules: {
    /** CSS has numbers as keys, making this frustrating  */
    "eslint/sort-keys": "off",
    /** Genuinely usefuful for css */
    "eslint/no-inline-comments": "off",
    /** Comments starting with numbers is common in css */
    "eslint/capitalized-comments": "off",
  },
});
