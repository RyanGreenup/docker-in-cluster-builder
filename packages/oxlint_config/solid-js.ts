import { defineConfig } from "oxlint";
import { baseConfig } from "./base";

export default defineConfig({
  extends: [baseConfig],

  jsPlugins: [
    "eslint-plugin-solid",
    { name: "sonarjs", specifier: "eslint-plugin-sonarjs" },
  ],
  rules: {
    // --- SolidJS reactivity (via jsPlugins) ---
    // Core: catches broken reactivity, the #1 SolidJS footgun
    "solid/reactivity": "error",
    // Destructuring props breaks reactivity tracking
    "solid/no-destructure": "error",
    // Use <For> instead of .map() for reactive lists
    "solid/prefer-for": "error",
    // Warn (not error): stylistic only — the Solid compiler handles ternaries fine.
    // Errors here would create noise on perfectly valid conditional rendering.
    "solid/prefer-show": "warn",
    // Components run exactly once; early returns break Solid's single-render model.
    // Conditionals belong inside JSX via <Show> / <Switch>. Classic React-brain bug.
    "solid/components-return-once": "error",
    // Enforces kebab-case CSS properties and string values with units in `style` props.
    // Catches silent rendering bugs (camelCase styles are dropped).
    "solid/style-prop": "error",
    // Tells no-unused-vars that components referenced only in JSX are used.
    // Default in the recommended config; explicit here to avoid false positives.
    "solid/jsx-uses-vars": "error",
    // Catches className, onChange, and other React-isms that silently fail
    "solid/no-react-specific-props": "error",
    // Prevents React hook patterns (useState, useEffect, etc.)
    "solid/no-react-deps": "error",
    // innerHTML is an XSS vector; use it deliberately
    "solid/no-innerhtml": "error",
    // Validate event handler naming (on:click, onClick, etc.)
    "solid/event-handlers": "error",
    // Catch undefined components in JSX
    "solid/jsx-no-undef": "error",
    // Duplicate props are always a bug
    "solid/jsx-no-duplicate-props": "error",
    // Enforce self-closing for void components
    "solid/self-closing-comp": "error",
    // Off: Electron 35 supports Proxies; this codebase uses createStore/produce/reconcile
    "solid/no-proxy-apis": "off",

    // --- SolidJS correctness additions ---
    // Catches import { createSignal } from "solid-js/web" — wrong subpath, silently broken
    "solid/imports": "error",
    // href="javascript:..." is XSS — same class of bug as no-innerhtml
    "solid/jsx-no-script-url": "error",
    // Type-unsafe event handler signatures — catches handlers that bypass SolidJS's EventHandler type
    "solid/no-array-handlers": "error",
    // <foo:bar /> unknown namespace prefixes are silent no-ops
    "solid/no-unknown-namespaces": "error",
    // Prefer classList over inline string concatenation in class prop.
    // Warn (not error): tv() returns a class string — that's valid. This fires only on raw concatenation.
    "solid/prefer-classlist": "warn",

    // Off: PascalCase is conventional for SolidJS components
    "unicorn/filename-case": "off",

    // On: prefer `undefined` as the single absence value. Approach B convention:
    //   - Never write `null` literals in own code
    //   - Nullish checks: `value === undefined` (not `== null`)
    //   - At DOM/library API boundaries that return `null`: use `=== null` with
    //     `checkStrictEquality: false` (default) — no inline disable needed
    //   - Rationale: `T | undefined` is simpler than `T | null | undefined`;
    //     TypeScript's own guidelines follow the same convention
    "unicorn/no-null": "error",
    // Strict equality everywhere — no-null makes == null unnecessary
    eqeqeq: ["error", "smart"],

    // --- oxlint v1.59–v1.60 rule audit ---
    //
    // GRADUATED FROM NURSERY — auto-enabled via category settings above.
    // No action needed; listed here so future audits can skip re-checking them.
    //   no-unnecessary-type-conversion  (suspicious) — catches String(x) when x is already a string
    //   dot-notation                    (style)      — obj.prop over obj["prop"]
    //   consistent-type-exports         (style)      — already explicitly enabled above
    //   no-useless-default-assignment   (correctness)— redundant ?? undefined patterns
    //   strict-void-return              (pedantic)   — disabled below (see note)
    //   no-unnecessary-type-parameters  (suspicious) — unused generics
    //   no-unnecessary-qualifier        (style)      — redundant namespace prefixes

    // GRADUATED — explicitly disabled:

    // Off: high false-positive rate with guard clauses and early returns in SolidJS effects;
    // the oxlint port is also not fully equivalent to ESLint's version yet.
    "consistent-return": "off",

    // Off: SolidJS signal setters (setFoo(val)) return the new value but are routinely
    // used in void positions (event handlers, effects, JSX callbacks). Callback refs
    // `ref={(el) => (ref = el)}` also trigger it — a documented CLAUDE.md pattern.
    // 98 false-positives on first run; not worth the noise.
    "typescript/strict-void-return": "off",

    // Off: too noisy for SolidJS — signal setters (Setter<T>), DOM event objects (Event,
    // HTMLElement), and store produce() drafts are all mutable by design. Enabling requires
    // a large DOM-type allowlist and would conflict with the no-eslint-disable rule.
    // Revisit if oxlint adds per-type ignores that cover SolidJS reactive patterns.
    // TODO
    // Consider scoping this to the actual things it benefits either allow or deny or whatever
    // the docs make an arg for it in places.
    // https://typescript-eslint.io/rules/prefer-readonly-parameter-types/
    // https://oxc.rs/docs/guide/usage/linter/rules/typescript/prefer-readonly-parameter-types.html
    "typescript/prefer-readonly-parameter-types": "off",

    // --- Tier 3: rules that fight Solid's grain (explicitly disabled) ---

    // Off: fires constantly on `onClick={() => setFoo(x)}` — idiomatic Solid.
    // An alternative would be `ignoreArrowShorthand: true`, but the rule has
    // minimal bug-catching value in Solid code either way.
    "typescript/no-confusing-void-expression": "off",

    // Off: classes are rare in Solid; the rule adds noise without catching bugs.
    "typescript/unbound-method": "off",

    // Off: nested `createSignal`/`createMemo` scopes legitimately shadow outer
    // variables. The TS-aware version can be enabled with
    // `ignoreOnInitialization: true` if shadowing ever causes a real bug.
    "typescript/no-shadow": "off",
    "no-shadow": "off",

    // Off: component return types are inferred (`JSX.Element` / fragments).
    // Explicit annotations create friction without catching regressions.
    // Standalone utility functions still benefit from return types — add a
    // `.ts`-only override if the team wants them enforced there.
    "typescript/explicit-function-return-type": "off",
    "typescript/explicit-module-boundary-types": "off",

    // NEW RULES — skipped (documented here to record the decision):
    //   unicorn/no-useless-iterator-to-array — not in this oxlint version
    //   unicorn/switch-case-break-position   — not in this oxlint version
    //   eslint/object-shorthand              — not in this oxlint version
    //   react/hook-use-state          — React rule; SolidJS has no useState
    //   react/prefer-function-component — React class components don't exist in SolidJS
    //   jest/padding-around-after-all-blocks — project uses Bun test runner, not Jest
    //   jest/prefer-snapshot-hint       — same: no Jest
    //   unicorn/prefer-import-meta-properties — no file-path introspection in a SPA
    //   eslint/no-restricted-exports    — configuration-only; no names to forbid right now
    //   unicorn/consistent-template-literal-escape — pedantic, rare edge case, low ROI
    //   general/no-useless-assignment   — enabled automatically via correctness category
  },
  overrides: [
    {
      // Vanilla-extract: token and sprinkles files are legitimately long data declarations.
      // All TypeScript safety rules remain strict — CSS correctness is VE's type system's job.
      // Remove this override if the project has no vanilla-extract .css.ts files.
      files: ["**/*.css.ts"],
      rules: {
        "max-lines": ["error", { max: 500 }],
        // zIndex as a bare integer (zIndex: 10) is standard CSS practice
        "no-magic-numbers": ["error", { ignore: [0, 1, 2, 10, 100] }],
      },
    },
    {
      // Test files: literals in assertions are specifications, not magic numbers.
      // max-lines-per-function stays at 50 — small it() blocks self-document expected behavior.
      files: ["**/*.test.ts", "**/*.test.tsx"],
      rules: {
        "no-magic-numbers": "off",
        "max-lines": ["error", { max: 500 }],
        // describe nesting adds to the complexity score; 10 is the right ceiling for test bodies
        "sonarjs/cognitive-complexity": ["error", 10],
      },
    },
    {
      // Test setup/fixture helpers are procedural by design. Convention: *.fixtures.ts,
      // files in factories/ directories, or files named helpers/test-*.
      // Complexity limit creates friction without safety benefit in setup code.
      files: ["**/*.fixtures.ts", "**/factories/**", "**/helpers/test-*"],
      rules: {
        "sonarjs/cognitive-complexity": "off",
      },
    },
    {
      // ECharts types are genuinely weak; no-explicit-any can't be fixed without forking the library
      files: ["**/echarts/**/*.ts", "**/echarts/**/*.tsx"],
      rules: {
        "typescript/no-explicit-any": "warn",
      },
    },
    {
      // createCachedSignal requires an explicit `undefined` argument to infer Value correctly
      // when the caller wants Value = T but the initial value is undefined
      files: ["**/echarts/examples/**/*.tsx", "**/routes/**/*.tsx"],
      rules: {
        "unicorn/no-useless-undefined": "off",
      },
    },
    {
      // Generated code may exceed style limits without issue
      files: ["src/generated/**/*"],
      rules: {
        "max-lines": "off",
      },
    },
    {
      // tanstack-virtual's getScrollElement option is typed `() => Element | null`,
      // so the scroll-container ref must resolve to `null` (not undefined) before
      // it is assigned — a third-party library API boundary, the same class of
      // exception as the HTTP/DB cases below.
      files: ["**/VirtualizedDataTable/**"],
      rules: {
        "unicorn/no-null": "off",
      },
    },
    // {
    //   // Drizzle-backed DB access: nullable columns surface as `T | null` by
    //   // design. Normalising to undefined at every read site is the exact
    //   // remember-to-do-it-everywhere discipline that caused the NULL
    //   // expiresAt crash. Let `null` propagate as SQL-semantic here.
    //   files: [
    //     "src/api/server/worksorted/oauth-store.ts",
    //     "src/api/server/worksorted/client.ts",
    //     "src/api/server/worksorted/schema.ts",
    //   ],
    //   rules: {
    //     "unicorn/no-null": "off",
    //   },
    // },
    // {
    //   // Hono HTTP boundary: ctx.body() requires `null` for 204 No Content
    //   // responses — `ContentlessStatusCode` (204, 205, 304) is excluded from
    //   // `ContentfulStatusCode`, so the only valid body is `null`. This is an
    //   // HTTP API boundary, not application logic.
    //   files: [
    //     "src/api/server/ai/chat/threads.ts",
    //     "src/api/server/ai/custom-agents/route.ts",
    //     "src/api/server/ai/kb/kb-route.ts",
    //     "src/api/server/ai/rag/route.ts",
    //   ],
    //   rules: {
    //     "unicorn/no-null": "off",
    //   },
    // },
  ],
  ignorePatterns: [
    "**/node_modules",
    "**/dist",
    "**/out",
    "**/*.d.ts",
    ".claude/worktrees",
    "e2e/**",
    "playwright.config.ts",
    "test-results/**",
  ],
});
