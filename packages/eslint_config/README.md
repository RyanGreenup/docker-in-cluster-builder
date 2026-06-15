# @rs/eslint-config

Shared ESLint flat-config **overlay** for the workspace. It is an approximate
parity port of `@rs/oxlint-config` (`base` and `solid-js`) for packages that lint
with ESLint instead of oxlint.

## Usage

This package is an overlay, not a standalone config. Spread it AFTER
`@tanstack/eslint-config` in a flat config:

```js
// eslint.config.js
import { tanstackConfig } from "@tanstack/eslint-config";
import solidConfig from "@rs/eslint-config/solid-js";

export default [
  ...tanstackConfig,
  ...solidConfig,
  { ignores: ["eslint.config.js", "src/routeTree.gen.ts"] },
];
```

`./base` is also exported for non-Solid packages.

## Why an overlay

Tanstack already registers the `@typescript-eslint` plugin and sets up type-aware
parsing (`tseslint.parser` + `parserOptions.project`). This overlay relies on
that: it sets `@typescript-eslint/*` rule severities and registers only the
plugins tanstack lacks (`unicorn`, `solid`, `jsdoc`, `sonarjs`, `turbo`). It does
not register `@typescript-eslint` (that would throw "Cannot redefine plugin") and
does not set a parser (so it inherits tanstack's). Used without tanstack, the
`@typescript-eslint/*` rules will not resolve.

## Parity notes

- Parity with the oxlint config is approximate. oxlint's `categories`
  (correctness/suspicious/pedantic/perf/style) have no 1:1 ESLint equivalent;
  they are approximated by tanstack's base rules, `unicorn` recommended, and the
  explicit strict rules in `base.js`.
- `typescript/strict-void-return` is omitted: no typescript-eslint equivalent
  exists (it was disabled in the oxlint config anyway).
- `no-magic-numbers` is left off (tanstack does not enable it and the ESLint
  version is noisy). The `*.css.ts` / `*.test.*` overrides that set it `off` are
  harmless no-ops kept for documentation parity.
- App-specific oxlint overrides (`echarts`, `VirtualizedDataTable`, drizzle/hono)
  are dropped. Kept: `*.css.ts`, `*.test.*`, fixtures/factories/test-helpers,
  `src/generated/**`.

## ESLint version

Pinned to ESLint 9. The plugins here (`eslint-plugin-jsdoc`,
`eslint-plugin-solid`) cap at ESLint 9, so do not bump ESLint to 10 without
replacing them.
