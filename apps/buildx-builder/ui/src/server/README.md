# `@server` (server-only)

Modules in this directory are server-only. The `@server/*` path alias
(`tsconfig.json`) maps here, and the `server-only-guard` plugin in
`vite.config.ts` makes everything under this directory physically unloadable in
the client bundle.

Client code may reference these modules with `import type` only:

```ts
import type { Build } from '@server/builds'
```

A value import (a missing `type` keyword, a re-export, an aliased path, a dynamic
`import()`) will fail the build, because it would drag server code into the
browser bundle. The same guard also covers the oRPC server packages listed in
its `packages` option (`@rs/buildx-builder-api`, `@rs/buildx-builder-lib`).

Any new server-only package must be added to that `packages` list in
`vite.config.ts`. Resolution is tolerant, so listing a package that the UI does
not depend on yet is safe: it is skipped until it becomes resolvable, then
guarded automatically.

The in-process oRPC demo that used to live here is not server-only (it runs in
the browser) and now lives at `src/demo/orpc-inprocess.ts`.
