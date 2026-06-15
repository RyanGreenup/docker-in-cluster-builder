// @ts-check
import jsdoc from "eslint-plugin-jsdoc";
import turbo from "eslint-plugin-turbo";
import unicorn from "eslint-plugin-unicorn";

/**
 * Base ESLint overlay, an approximate parity port of `@rs/oxlint-config/base`.
 *
 * This is an overlay, not a standalone config: it is meant to be spread AFTER
 * `@tanstack/eslint-config`, which registers the `@typescript-eslint` plugin and
 * sets up type-aware parsing (`tseslint.parser` + `parserOptions.project`). The
 * `@typescript-eslint/*` rules below resolve against that registration once
 * ESLint merges the matching flat-config objects for a file. The overlay
 * deliberately does not register `@typescript-eslint` itself (doing so with a
 * different plugin instance would throw "Cannot redefine plugin") and does not
 * set a parser (so it inherits tanstack's type-aware parser).
 *
 * `eslint-plugin-unicorn` is not part of tanstack, so its recommended config is
 * included here to register the `unicorn` plugin and approximate the oxlint
 * unicorn/pedantic/style coverage.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const baseConfig = [
  // unicorn recommended (registers the `unicorn` plugin + its rule set)
  unicorn.configs.recommended,

  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: { jsdoc, turbo },
    rules: {
      // TurboRepo
      "turbo/no-undeclared-env-vars": "error",

      // --- Strict public API documentation ---
      "jsdoc/check-access": "error",
      "jsdoc/check-alignment": "error",
      "jsdoc/check-param-names": "error",
      "jsdoc/check-property-names": "error",
      // `typed: true` validates against the JSDoc tag vocabulary, which omits
      // TSDoc-only block tags. `definedTags` re-admits the TSDoc tags
      // (`@remarks`, `@typeParam`, etc.) so they are not flagged as
      // "invalid JSDoc tag name".
      "jsdoc/check-tag-names": [
        "error",
        { typed: true, definedTags: ["remarks", "privateRemarks", "typeParam", "defaultValue"] },
      ],
      "jsdoc/check-types": "error",
      "jsdoc/check-values": "error",
      "jsdoc/empty-tags": "error",
      "jsdoc/informative-docs": "error",
      "jsdoc/no-blank-block-descriptions": "error",
      "jsdoc/no-blank-blocks": "error",
      "jsdoc/no-defaults": "error",
      "jsdoc/no-types": "error",
      "jsdoc/require-description": ["error", { contexts: ["any"] }],
      // Off: the autofix double-punctuates and fights TSDoc prose containing
      // inline code, `{@link}` tags, and version numbers.
      "jsdoc/require-description-complete-sentence": "off",
      "jsdoc/require-jsdoc": [
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
      "jsdoc/require-param": "error",
      "jsdoc/require-param-description": "error",
      "jsdoc/require-param-name": "error",
      "jsdoc/require-returns": "error",
      "jsdoc/require-returns-check": "error",
      "jsdoc/require-returns-description": "error",
      "jsdoc/valid-types": "error",

      // Import ordering is owned by the formatter; disabled to avoid fighting it.
      "sort-imports": "off",

      // --- Style limits ---
      "max-lines": ["error", { max: 300 }],
      "max-lines-per-function": ["error", { max: 50 }],
      "max-params": ["error", { max: 3 }],

      // --- TypeScript strict safety ---
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-unsafe-argument": "error",

      // --- Async correctness ---
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      // checksVoidReturn.attributes=false: without it, every onClick={async () => ...} flags
      "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: { attributes: false } }],

      // --- Type hygiene ---
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/strict-boolean-expressions": "error",
      // allowNumber: signal getters returning numbers are interpolated constantly
      "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
      "@typescript-eslint/switch-exhaustiveness-check": [
        "error",
        {
          considerDefaultExhaustiveForUnions: true,
          requireDefaultForNonUnion: false,
        },
      ],

      // 80% of prefer-readonly-parameter-types without the noise
      "no-param-reassign": "error",
    },
  },
];

export default baseConfig;
