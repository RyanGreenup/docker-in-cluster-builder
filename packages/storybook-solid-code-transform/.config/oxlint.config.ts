import { baseConfig } from "@rs/oxlint-config/base";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [baseConfig],
  overrides: [
    {
      // Test files: literal JSX strings are specifications, not magic numbers;
      // long describe blocks and many statements are expected in a spec suite.
      files: ["**/*.test.ts"],
      rules: {
        "id-length": "off",
        "max-lines": ["error", { max: 500 }],
        "max-lines-per-function": "off",
        "max-statements": "off",
        "no-magic-numbers": "off",
        "no-template-curly-in-string": "off",
        "no-ternary": "off",
        "unicorn/no-null": "off",
      },
    },
  ],
});
