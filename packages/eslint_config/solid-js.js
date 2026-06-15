// @ts-check
import solid from "eslint-plugin-solid";
import sonarjs from "eslint-plugin-sonarjs";
import { baseConfig } from "./base.js";

/**
 * SolidJS ESLint overlay, an approximate parity port of
 * `@rs/oxlint-config/solid-js`. Extends {@link baseConfig} with SolidJS
 * reactivity rules, a few unicorn/eslint tweaks, the pragmatic disables that
 * keep the rule set quiet on idiomatic Solid code, and file-scoped overrides.
 *
 * Like the base, this is an overlay meant to be spread AFTER
 * `@tanstack/eslint-config`. The `solid` and `sonarjs` plugins are registered
 * here; `@typescript-eslint` and `unicorn` are registered by tanstack and the
 * base overlay respectively, so their rules resolve via flat-config merge.
 *
 * JSX/TSX is parsed by tanstack's `tseslint.parser` (by file extension), so the
 * `solid/configs["flat/typescript"]` preset is intentionally not spread here:
 * it would override tanstack's type-aware `languageOptions`.
 *
 * @type {import("eslint").Linter.Config[]}
 */
const solidConfig = [
  ...baseConfig,

  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: { solid, sonarjs },
    rules: {
      // --- SolidJS reactivity ---
      // Core: catches broken reactivity, the #1 SolidJS footgun
      "solid/reactivity": "error",
      // Destructuring props breaks reactivity tracking
      "solid/no-destructure": "error",
      // Use <For> instead of .map() for reactive lists
      "solid/prefer-for": "error",
      // Warn (not error): stylistic only; the Solid compiler handles ternaries fine
      "solid/prefer-show": "warn",
      // Components run exactly once; early returns break Solid's single-render model
      "solid/components-return-once": "error",
      // Enforces kebab-case CSS properties; camelCase styles are silently dropped
      "solid/style-prop": "error",
      // Tells no-unused-vars that components referenced only in JSX are used
      "solid/jsx-uses-vars": "error",
      // Catches className, onChange, and other React-isms that silently fail
      "solid/no-react-specific-props": "error",
      // Prevents React hook patterns (useState, useEffect, etc.)
      "solid/no-react-deps": "error",
      // innerHTML is an XSS vector
      "solid/no-innerhtml": "error",
      // Validate event handler naming (on:click, onClick, etc.)
      "solid/event-handlers": "error",
      // Catch undefined components in JSX
      "solid/jsx-no-undef": "error",
      // Duplicate props are always a bug
      "solid/jsx-no-duplicate-props": "error",
      // Enforce self-closing for void components
      "solid/self-closing-comp": "error",
      // Off: Proxies are supported; this codebase uses createStore/produce/reconcile
      "solid/no-proxy-apis": "off",
      // Catches wrong subpath imports (import { createSignal } from "solid-js/web")
      "solid/imports": "error",
      // href="javascript:..." is XSS, same class as no-innerhtml
      "solid/jsx-no-script-url": "error",
      // Type-unsafe event handler signatures
      "solid/no-array-handlers": "error",
      // <foo:bar /> unknown namespace prefixes are silent no-ops
      "solid/no-unknown-namespaces": "error",
      // Warn (not error): tv() returns a class string, which is valid
      "solid/prefer-classlist": "warn",

      // Off: PascalCase is conventional for SolidJS components
      "unicorn/filename-case": "off",
      // Off: `props`/`Props` is the canonical SolidJS naming; renaming it to
      // `properties` fights the framework's grain for no safety benefit.
      "unicorn/prevent-abbreviations": "off",
      // Prefer `undefined` as the single absence value
      "unicorn/no-null": "error",

      // Strict equality everywhere
      eqeqeq: ["error", "smart"],

      // --- Pragmatic disables (rules that fight Solid's grain) ---
      // Off: high false-positive rate with guard clauses / early returns in effects
      "consistent-return": "off",
      // Off: too noisy; signal setters, DOM events, and produce() drafts are mutable by design
      "@typescript-eslint/prefer-readonly-parameter-types": "off",
      // Off: fires on `onClick={() => setFoo(x)}`, which is idiomatic Solid
      "@typescript-eslint/no-confusing-void-expression": "off",
      // Off: classes are rare in Solid; adds noise without catching bugs
      "@typescript-eslint/unbound-method": "off",
      // Off: nested createSignal/createMemo scopes legitimately shadow outer vars
      "@typescript-eslint/no-shadow": "off",
      "no-shadow": "off",
      // Off: component return types are inferred (JSX.Element / fragments)
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      // Note: oxlint's `typescript/strict-void-return` has no typescript-eslint
      // equivalent, so it is omitted (it was disabled in the oxlint config anyway).
    },
  },

  {
    // Vanilla-extract: token and sprinkles files are legitimately long declarations.
    files: ["**/*.css.ts"],
    rules: {
      "max-lines": ["error", { max: 500 }],
      "@typescript-eslint/no-magic-numbers": "off",
    },
  },
  {
    // Test files: literals in assertions are specifications, not magic numbers.
    files: ["**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "@typescript-eslint/no-magic-numbers": "off",
      "max-lines": ["error", { max: 500 }],
      "sonarjs/cognitive-complexity": ["error", 10],
    },
  },
  {
    // Test setup/fixture helpers are procedural by design.
    files: ["**/*.fixtures.ts", "**/factories/**", "**/helpers/test-*"],
    rules: {
      "sonarjs/cognitive-complexity": "off",
    },
  },
  {
    // Generated code may exceed style limits without issue.
    files: ["src/generated/**/*"],
    rules: {
      "max-lines": "off",
    },
  },

  {
    ignores: [
      "**/*.d.ts",
      ".claude/worktrees/**",
      "e2e/**",
      "playwright.config.ts",
      "test-results/**",
    ],
  },
];

export default solidConfig;
