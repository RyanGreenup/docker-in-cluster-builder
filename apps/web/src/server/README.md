# `@server` (server-only)

Modules in this directory are server-only. The `@server/*` path alias maps here,
and the `server-only-guard` plugin in `vite.config.ts` makes everything under
this directory unloadable in the client bundle.

Client code may reference these modules with `import type` only:

```ts
import type { SomeServerType } from '@server/example'
```

A value import, re-export, aliased path, or dynamic `import()` fails the build
because it would pull server code into the browser bundle. The same guard also
covers the oRPC API package listed in `vite.config.ts`: `@template/api`.

Prefer placing oRPC procedures in `apps/api`. The web app should call them over
HTTP through `src/orpc.ts`, importing the router type only.
