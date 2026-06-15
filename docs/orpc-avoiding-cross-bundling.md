# Avoiding Cross-bundling With oRPC

The browser bundle must not include oRPC procedure handlers, secrets, or Node
modules. In this template, the boundary is:

- `apps/api` owns `@orpc/server`, procedure handlers, and the router value.
- `apps/web` owns `@orpc/client` and a typed `RPCLink` client.
- `apps/web` imports `@template/api` with `import type` only.

## Core Rule

The client never needs the router value. It only needs the router type:

```ts
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { router } from "@template/api";

const link = new RPCLink({ url: "/rpc" });
export const client: RouterClient<typeof router> = createORPCClient(link);
```

`typeof router` is erased at compile time, so no server code is emitted into the
browser bundle.

## Backstop Guard

`apps/web/plugins/vite-plugin-server-only.ts` blocks guarded roots/packages from
the client graph. It catches mistakes such as:

- a missing `type` keyword
- a value re-export from `@template/api`
- a dynamic import of a server-only module

`verbatimModuleSyntax: true` in `apps/web/tsconfig.json` keeps type-only imports
explicit and erasable.

## Adding More Server Code

- Prefer putting oRPC procedures in `apps/api`.
- If a server-only workspace package is added, expose `./package.json` in its
  `exports` map and add the package name to `serverOnlyGuard`.
- If the app grows, consider a contract-first package with `@orpc/contract` so
  the web app depends on contracts and schemas rather than handler packages.

## Sources

1. Client-Side Clients - oRPC: https://orpc.dev/docs/client/client-side
2. Optimize Server-Side Rendering - oRPC: https://orpc.dev/docs/best-practices/optimize-ssr
3. Monorepo Setup - oRPC: https://orpc.dev/docs/best-practices/monorepo-setup
