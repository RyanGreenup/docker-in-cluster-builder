import { defineConfig } from "oxlint";

export const baseConfig = defineConfig({
  plugins: ["typescript", "unicorn", "oxc"],
  jsPlugins: [
    { name: "jsdoc-js", specifier: "eslint-plugin-jsdoc" },
    { name: "turbo", specifier: "eslint-plugin-turbo" },
  ],
  categories: {
    correctness: "error",
    suspicious: "error",
    pedantic: "error",
    perf: "error",
    style: "error",
  },

  rules: {
    // TurboRepo Stuff
    "turbo/no-undeclared-env-vars": "error",

    // --- Strict public API documentation ---
    "jsdoc-js/check-access": "error",
    "jsdoc-js/check-alignment": "error",
    "jsdoc-js/check-param-names": "error",
    "jsdoc-js/check-property-names": "error",
    // `typed: true` validates against the JSDoc tag vocabulary, which omits
    // TSDoc-only block tags. `definedTags` re-admits the TSDoc tags
    // (`@remarks`, `@typeParam`, etc.) so they are not flagged as
    // "invalid JSDoc tag name".
    "jsdoc-js/check-tag-names": [
      "error",
      { typed: true, definedTags: ["remarks", "privateRemarks", "typeParam", "defaultValue"] },
    ],
    "jsdoc-js/check-types": "error",
    "jsdoc-js/check-values": "error",
    "jsdoc-js/empty-tags": "error",
    "jsdoc-js/informative-docs": "error",
    "jsdoc-js/no-blank-block-descriptions": "error",
    "jsdoc-js/no-blank-blocks": "error",
    "jsdoc-js/no-defaults": "error",
    "jsdoc-js/no-types": "error",
    "jsdoc-js/require-description": ["error", { contexts: ["any"] }],
    // Off: the autofix double-punctuates (`0.3.1.` -> `0.3.1..`) and fights
    // TSDoc prose containing inline code, `{@link}` tags, and version numbers.
    // `eslint/capitalized-comments` still keeps sentence-initial capitals.
    "jsdoc-js/require-description-complete-sentence": "off",
    "jsdoc-js/require-jsdoc": [
      "error",
      {
        publicOnly: true,
        require: {
          ArrowFunctionExpression: true,
          ClassDeclaration: true,
          FunctionDeclaration: true,
          FunctionExpression: true,
          MethodDefinition: true,
        },
      },
    ],
    "jsdoc-js/require-param": "error",
    "jsdoc-js/require-param-description": "error",
    "jsdoc-js/require-param-name": "error",
    "jsdoc-js/require-returns": "error",
    "jsdoc-js/require-returns-check": "error",
    "jsdoc-js/require-returns-description": "error",
    "jsdoc-js/valid-types": "error",

    /** Import ordering is owned by oxfmt; disabled to avoid fighting its sort. */
    "sort-imports": "off",
    // --- Style limits --- (
    // NOTE these are the default for the style category
    // explicit to avoid regressions etc.
    "max-lines": ["error", { max: 300 }],
    "max-lines-per-function": ["error", { max: 50 }],
    "max-params": ["error", { max: 3 }],

    // --- TypeScript strict safety ---
    // Worth it for own code; expect type assertions at third-party library boundaries
    // where packages (especially newer solid-primitives modules) have weak typings
    "typescript/no-explicit-any": "error",
    "typescript/no-unsafe-assignment": "error",
    "typescript/no-unsafe-call": "error",
    "typescript/no-unsafe-member-access": "error",
    "typescript/no-unsafe-return": "error",
    "typescript/no-unsafe-argument": "error",

    // --- Async correctness ---
    // Valuable; use `void fetchData()` for intentional fire-and-forget in createEffect
    "typescript/no-floating-promises": "error",
    "typescript/await-thenable": "error",
    // checksVoidReturn.attributes=false: without it, every onClick={async () => ...} flags
    "typescript/no-misused-promises": [
      "error",
      { checksVoidReturn: { attributes: false } },
    ],

    // --- Type hygiene ---
    "typescript/consistent-type-imports": "error",
    "typescript/consistent-type-exports": "error",
    // Warn-only in .tsx would be defensible — Solid props often have wider runtime
    // types than TS believes, so removing "unnecessary" defensive checks can introduce
    // real bugs. Keep error for now; add a .tsx override if it becomes noisy.
    "typescript/no-unnecessary-condition": "error",
    "typescript/prefer-nullish-coalescing": "error",
    // `!` assertions in Solid frequently mask "signal not resolved yet" bugs;
    // the correct pattern is `<Show when={x}>{(val) => ...}</Show>`.
    "typescript/no-non-null-assertion": "error",
    // Catches `{count && <X/>}` rendering `0` as text, and interpolating
    // non-strings into template literals. Junior-hostile for a week, then the
    // bugs stop.
    "typescript/strict-boolean-expressions": "error",
    // allowNumber: signal getters returning numbers are used in template literals
    // constantly (`${count()}`). Without it this fires all day on valid code.
    // Still catches interpolating objects, which is the real bug.
    "typescript/restrict-template-expressions": [
      "error",
      { allowNumber: true },
    ],
    "typescript/switch-exhaustiveness-check": [
      "error",
      {
        considerDefaultExhaustiveForUnions: true,
        requireDefaultForNonUnion: false,
      },
    ],

    // This is 80% of the prefer-readonly-parameter-types
    // without the noise
    "no-param-reassign": "error",
  },
});
