# Avoiding cross-bundling with oRPC

How to keep server code (procedure handlers, router implementation, secrets,
node-only modules) out of the browser bundle when using oRPC, for two layouts:
a single package and a monorepo. Every claim below is backed by an official oRPC
source, linked inline and collected at the end.

## The core principle (applies to both layouts)

The client never needs the router *value*. A client is built from a transport
link, and the router only appears in a *type* position:

```ts
import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import type { RouterClient } from '@orpc/server'

const link = new RPCLink({ url: 'https://example.com/rpc' })
const client: RouterClient<typeof router> = createORPCClient(link)
```

The runtime client comes entirely from `createORPCClient(link)`; `router` is used
only as `typeof router`, a type-level reference, so it is erased at compile time
and no server code is bundled. See the client-side client setup in the official
docs [1]. The same shape works with a contract: `ContractRouterClient<typeof contract>` [1].

This means the primary defense against cross-bundling is simply: **the client
references the router (or contract) as a type only.** Type-only references carry
no runtime cost.

oRPC's own backstop, for the cases where a server value genuinely must be
referenced near client code (server-side rendering with an in-process client),
is the `server-only` package plus a `globalThis` handoff. The SSR guide states
the goal directly: "We need a hack that ensures server-only code never reaches
the browser", and shows `import 'server-only'` in a `*.server.ts` module whose
client instance is shared through `globalThis` rather than imported [2]. A naive
`typeof window === 'undefined'` check is called out as insufficient because it
"exposes your router logic to the client" [2].

Note: `server-only` enforces itself through bundler export conditions (the
React Server Components `react-server` condition). A plain SPA bundler (for
example a non-RSC Vite app) does not resolve that condition, so a local
equivalent (a bundler plugin that refuses to load server modules into the client
graph) plays the same role. This is a substitute for `server-only`, not a new
requirement.

## Single package (one app, no shared packages)

When the server and client live in one package (an SPA that also defines its
procedures, or a single fullstack app):

- The client imports `@orpc/client` + `RPCLink` and types the client with
  `RouterClient<typeof router>`, importing the router as a type only [1].
- Keep server-only modules (handlers, the router, any node-only or secret-bearing
  code) in their own files. The oRPC SSR guidance is to split server and client
  logic into separate modules and guard the server module so it cannot be pulled
  into the browser build [2].
- For SSR specifically, oRPC shares the in-process `createRouterClient` instance
  via `globalThis` from a `server-only`-guarded module, so the client bundle gets
  the network client and never the router implementation [2].
- If the bundler is not RSC-aware (so `server-only` does not self-enforce), apply
  the equivalent guard at the bundler level: refuse to load the server modules
  into the client graph. Because type-only imports are erased before the bundler
  resolves them, such a guard only ever fires on real value imports, including
  those reached through re-exports or dynamic imports.

Net: in a single package the client should import only `@orpc/client`/`RPCLink`
and the router *type*; everything else server-side stays in guarded modules.

## Monorepo (shared packages)

The official monorepo guide [3] defines three layouts. The difference that
matters here is what the web/client app imports:

- **Contract-first**: a `core-contract` package defines the contract with
  `@orpc/contract`; the `api` app implements it; the `web` app imports the
  **contract** and sets up the client [3]. Because the contract package holds no
  server implementation, the client depends on a package with no server runtime
  to leak. Contract types are extracted with helpers such as
  `InferContractRouterInputs` / `InferContractRouterOutputs` [4].
- **Service-first**: a `core-service` package defines the procedures/router; the
  `web` app imports the **service** and sets up the client [3], typing it as
  `RouterClient<typeof router>` with a type-only import [1].
- **Hybrid**: `core-contract` plus a `core-service` that implements it; the
  `web` app imports the **contract** [3].

The guide makes two structural recommendations:

1. **Use TypeScript Project References.** Shared packages set `composite: true`
   and consumers list them under `references` in `tsconfig.json`; this lets the
   client resolve the router/contract types across packages without bundling and
   without type duplication [3].
2. **Avoid alias imports for server components**; link shared packages through
   the workspace package manager instead [3].

So in a monorepo the client should import either the **contract package**
(strongest separation: no server runtime in the dependency at all) or, in
service-first, the **service package's router as a type**. It should import the
shared `packages/` module, not the deployable `api` app. Cross-bundling is
avoided by the same core principle (type-only reference of router/contract),
reinforced by project references and, where a server value must sit near client
code, by `server-only` [1][2][3][4].

## Summary

- Both layouts: the client builds its client from `RPCLink` + `createORPCClient`
  and references the router/contract as a **type only**; the router value is
  never imported into client code [1].
- Single package: split and guard server-only modules; for SSR use
  `server-only` + `globalThis` [2].
- Monorepo: import a shared **contract** (or service router type) package via
  **TypeScript project references**, not alias imports, and not the api app [3][4].
- `server-only` is oRPC's recommended bundler-level backstop; a non-RSC bundler
  needs a local equivalent guard, but that backstop is secondary to type-only
  imports [2].

## Sources

1. Client-Side Clients - oRPC: https://orpc.dev/docs/client/client-side
2. Optimize Server-Side Rendering (SSR) - oRPC: https://orpc.dev/docs/best-practices/optimize-ssr
3. Monorepo Setup - oRPC: https://orpc.dev/docs/best-practices/monorepo-setup
4. Contract-first, Define Contract - oRPC: https://orpc.dev/docs/contract-first/define-contract
