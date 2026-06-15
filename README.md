# buildx-builder

Generic TypeScript CLI and library bundle.

> [!NOTE]
> Some packages are imported from our local npm registry (kubernetes-3)
> via .npmrc.

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
