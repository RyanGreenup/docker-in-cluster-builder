# buildx-builder - Project Conventions

## Stack

- Runtime target: Node.js-compatible ESM built from TypeScript.
- Package manager: pnpm workspaces.
- Build: `tsdown`.
- CLI framework: `citty`.
- Tests: `vitest`.
- Type checking: `tsgo --skipLibCheck --noEmit`.
- Lint/format: `oxlint` and `oxfmt`.

## Project structure

```text
buildx-builder/
├── apps/buildx-builder/lib/      # reusable library package
├── apps/buildx-builder/cli/      # executable CLI package
└── packages/oxlint_config/
```

## Boundaries

- Keep reusable behavior in `lib`.
- Keep CLI argument parsing and process-facing behavior in `cli`.
- The CLI may depend on the library; the library must not depend on the CLI.
- Keep placeholder/example functions generic until real domain behavior is added.

## Verification

Run `pnpm run check` after code changes. For CLI wiring changes, also run:

```sh
pnpm --dir apps/buildx-builder/cli run test:e2e
```
