# buildx-builder

Generic TypeScript CLI and library bundle.

## Packages

- `apps/buildx-builder/lib` exports reusable placeholder library functions.
- `apps/buildx-builder/cli` exposes the `buildx-builder-cli` command and depends on `@rs/buildx-builder-lib` via `workspace:*`.
- `packages/oxlint_config` provides shared oxlint and oxfmt config consumed by both packages.

## Commands

```sh
pnpm install
pnpm run build
pnpm run test
pnpm run check
pnpm --dir apps/buildx-builder/cli run cli -- World
```
