import { defineConfig } from "oxfmt";
export const baseFmt = defineConfig({
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  tabWidth: 2,
  printWidth: 100,
  sortImports: {
    groups: [
      ["value-builtin", "value-external"],
      "value-internal",
      ["value-parent", "value-sibling", "value-index"],
      "type-import",
      ["type-parent", "type-sibling", "type-index"],
      "unknown",
    ],
    newlinesBetween: true,
  },
  // sortTailwindcss: {
  //   functions: ["tv"],
  //   stylesheet: "./src/styles.css",
  // },
  ignorePatterns: ["dist", "out", "node_modules"],
});
