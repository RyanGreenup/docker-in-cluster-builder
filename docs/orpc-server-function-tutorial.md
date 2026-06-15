# Tutorial: a prod-positioned oRPC server function, then migrating it to a workspace package

This walks through adding a server-side oRPC procedure in the simplest way that
is still safe for production (no server code in the browser bundle), then
migrating it into a dedicated workspace package so cross-bundling becomes
structurally impossible rather than merely guarded.

It uses the `builds` service in this repo as the worked example. Every
cross-bundling claim is backed by an official oRPC source, cited inline and
listed at the end. See also the conceptual companion doc
[`orpc-avoiding-cross-bundling.md`](./orpc-avoiding-cross-bundling.md).

## Which approach, and why

Two places server-only oRPC code can live in a frontend repo:

|                                                 | In-app `src/server/` directory                               | Dedicated workspace package                                           |
| ----------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------- |
| Cross-bundling defense                          | Type-only imports + a bundler guard plugin                   | Type-only imports + separate build/process                            |
| Server runtime deps (`@orpc/server`, node libs) | In the app's own `package.json`, reachable from client files | In the package's `package.json`, not the app's                        |
| Failure mode                                    | Remove/misorder the guard plugin and protection is gone      | Server code is a different artifact; it cannot enter the client build |
| Enforcement scope                               | Only the bundler that runs the plugin                        | The package manager and the build boundary, everywhere                |

The natural path is to start in-app (fast, one repo area) and migrate out. The
end state worth aiming for: the **client app no longer depends on `@orpc/server`
or the router source at all**. It imports only the router _type_ from the
package and talks to it over HTTP. At that point a value import of server code is
not "blocked", it is unrepresentable, because the implementation is a separate
build run as a separate process and the only thing crossing the boundary is
erased type information [1][2].

Short version: the workspace package wins, because its protection is structural
(separate artifact + type-only consumption), not a single bundler hook. Start
in-app for speed; migrate out to make the boundary real.

## Background: why type-only imports are the actual defense

An oRPC client is built from a transport link, not from the router value. The
router appears only in a type position:

```ts
const client: RouterClient<typeof router> = createORPCClient(link);
```

`typeof router` is erased at compile time, so the runtime client carries no
server code; calls go over the link [1]. This erasure is the primary
cross-bundling defense. It requires that the import be type-only. With
`verbatimModuleSyntax: true` (set in `apps/buildx-builder/ui/tsconfig.json`), a
type-only import must be written `import type`, and any value import is preserved
in the emitted JS, which is exactly what lets a guard catch mistakes.

oRPC's own backstop for cases where a server value sits near client code (an
in-process client used during SSR) is the `server-only` package plus a
`globalThis` handoff; the SSR guide states the goal as ensuring "server-only
code never reaches the browser" [2]. A plain SPA bundler does not resolve the
export conditions `server-only` relies on, so this repo uses an equivalent Vite
plugin (`apps/buildx-builder/ui/plugins/vite-plugin-server-only.ts`) as the
backstop. The backstop is secondary; the type-only import is the mechanism.

## Part 1: implement a server function, prod-positioned, in-app

Goal: a typed `builds.trigger` / `builds.list` procedure the UI can call, over
HTTP, with no server code in the client bundle. This is the simple starting
point: the procedures live in the app repo, the client consumes them as types.

### 1.1 Define the procedures (server-only module)

Put server code in a guarded location. In this repo that is `src/server/` (the
`@server/*` alias maps there and the guard plugin makes it unloadable in the
client bundle, see `apps/buildx-builder/ui/src/server/README.md`).

```ts
// src/server/builds.ts
import { ORPCError, os } from "@orpc/server";
import * as zod from "zod";

const FIRST_BUILD_ID = 1;

const BuildSchema = zod.object({
  id: zod.number().int().min(FIRST_BUILD_ID),
  status: zod.enum(["queued", "running", "succeeded", "failed"]),
  tag: zod.string().min(1),
});

export type Build = zod.infer<typeof BuildSchema>;

// In-memory store standing in for a real backend.
const builds: Build[] = [];

export const router = {
  builds: {
    trigger: os.input(BuildSchema.pick({ tag: true })).handler(({ input }) => {
      const build: Build = {
        id: builds.length + FIRST_BUILD_ID,
        status: "queued",
        tag: input.tag,
      };
      builds.push(build);
      return build;
    }),
    list: os.handler(() => [...builds]),
    find: os.input(BuildSchema.pick({ id: true })).handler(({ input }) => {
      const build = builds.find((b) => b.id === input.id);
      if (!build) {
        throw new ORPCError("NOT_FOUND", { message: `No build ${input.id}` });
      }
      return build;
    }),
  },
};
```

### 1.2 Expose it over HTTP (a separate process)

Even "in-app", the server must run as its own process so it is never part of the
client build. Use the Node RPC handler and the CORS plugin [3][4]:

```ts
// src/server/http.ts   (run with: tsx src/server/http.ts)
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/node";
import { CORSPlugin } from "@orpc/server/plugins";
import { createServer } from "node:http";

import { router } from "./builds";

const handler = new RPCHandler(router, {
  interceptors: [onError((error) => console.error(error))],
  plugins: [new CORSPlugin()],
});

createServer(async (req, res) => {
  const { matched } = await handler.handle(req, res, {
    context: { headers: req.headers },
  });
  if (!matched) {
    res.statusCode = 404;
    res.end("No procedure matched");
  }
}).listen(3001, "127.0.0.1");
```

### 1.3 Consume it from the client (type-only)

A single shared client module. The router is imported as a **type only**, so no
server code is bundled [1]:

```ts
// src/orpc.ts
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { router } from "./server/builds"; // TYPE ONLY

const link = new RPCLink({ url: "http://127.0.0.1:3001" });

export const client: RouterClient<typeof router> = createORPCClient(link);
```

Then call it from a route, importing the `Build` type only:

```ts
import type { Build } from "./server/builds";
import { client } from "./orpc";

const builds = await client.builds.list();
await client.builds.trigger({ tag: "app:latest" });
```

### 1.4 What protects you here, and what does not

- Protected: the client references `router`/`Build` as types, which erase, so
  nothing server-side is emitted [1]. The guard plugin catches a slipped value
  import (a dropped `type`, a re-export) by refusing to load `src/server/`
  modules into the client graph.
- Residual risk: the app still lists `@orpc/server` and node-only deps in its
  own `package.json`, and the server source lives in the app. So a client file
  _can resolve_ server modules; only the guard plugin and discipline stop a value
  import. Protection is one bundler hook, scoped to that bundler.

That residual risk is the motivation for Part 2.

## Part 2: migrate it into a workspace package

Goal: move the server implementation into its own package, have the app depend
only on its types, and remove `@orpc/server` (the server runtime) from the app.
After this, the client cannot cross-bundle server code because the server is a
different build run as a different process, consumed type-only [1][5].

### 2.1 Create the package

```
apps/buildx-builder/api/
  package.json
  tsconfig.json
  src/
    index.ts     // procedures + router + exported types (moved from src/server/builds.ts)
    server.ts    // the HTTP entry (moved from src/server/http.ts)
```

`package.json` (the server runtime deps now live here, not in the UI):

```jsonc
{
  "name": "@rs/buildx-builder-api",
  "type": "module",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./package.json": "./package.json",
  },
  "dependencies": {
    "@orpc/server": "^1.14.6",
    "zod": "^4.4.3",
  },
}
```

Exposing `./package.json` in `exports` lets tooling (including the guard plugin)
resolve the package root through pnpm symlinks. Move `src/server/builds.ts` to
`src/index.ts` and `src/server/http.ts` to `src/server.ts` (importing `./index`).
The oRPC monorepo guide calls this "separating the server component into a
dedicated package containing only necessary files" [5].

### 2.2 Point the app at the package's types

Add the package as a dependency of the UI and change the client to import the
router type from the package instead of a local path:

```ts
// src/orpc.ts
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { router } from "@rs/buildx-builder-api"; // TYPE ONLY, from the package

const link = new RPCLink({ url: "http://127.0.0.1:3001" });

export const client: RouterClient<typeof router> = createORPCClient(link);
```

```ts
// route
import type { Build } from "@rs/buildx-builder-api";
import { client } from "../orpc";
```

The oRPC guide recommends linking shared packages through the workspace manager
and using **TypeScript project references** (`composite: true` on the package,
`references` in the consumer's `tsconfig.json`) so types resolve across packages
without bundling, and to avoid alias imports for this boundary [5].

### 2.3 Remove the server runtime from the app

This is the step that makes cross-bundling impossible rather than guarded:

- Delete the moved files from the app (`src/server/builds.ts`, `src/server/http.ts`).
- Remove `@orpc/server` from the UI's `dependencies` if nothing else in the
  client needs it. The client keeps only `@orpc/client`. Now `@orpc/server` and
  the router implementation are not resolvable from the app at all, so a value
  import cannot even type-check or resolve.
- Keep the guard plugin and list the package in it as defense in depth (this
  repo lists `@rs/buildx-builder-api`). Note the plugin's resolution is tolerant:
  a package the UI does not depend on is skipped and guarded only once reachable,
  so listing server-only siblings like `@rs/buildx-builder-lib` is safe.

### 2.4 Run it

```sh
pnpm --dir apps/buildx-builder/api run dev   # serves the router on 127.0.0.1:3001
pnpm --dir apps/buildx-builder/ui  run dev   # client calls it over HTTP
```

### 2.5 Why this is stronger

- The router runs as a separate process from a separate build; its code is never
  in the client's build graph [1][5].
- The app depends only on `@orpc/client` and the package's **types**; the server
  runtime (`@orpc/server`, node libs) is not in the app's dependency graph, so a
  value import is unresolvable, not merely linted away.
- The guard plugin remains as a backstop but is no longer the only thing standing
  between server code and the browser.

## Going further: contract-first

The strongest separation is contract-first: a `core-contract` package defines
the contract with `@orpc/contract` (schemas and types only, no handlers); the
`api` app implements it and the `web` app imports the **contract** to build the
client [5][6]. The client then depends on a package with no server runtime at
all, and types are extracted with helpers like `InferContractRouterInputs` /
`InferContractRouterOutputs` [6]. This repo already has a contract under
`apps/buildx-builder/lib/src/api/contract/` that could become that package.

## Checklist

- [ ] Procedures defined with `os` + zod, exported in a `router`.
- [ ] Types (`Build`, etc.) exported for the client to import as types.
- [ ] HTTP entry uses `RPCHandler` (`@orpc/server/node`) + `CORSPlugin` [3][4].
- [ ] Client built from `RPCLink` + `createORPCClient`, router imported as a type [1].
- [ ] `verbatimModuleSyntax: true` so type-only imports are explicit and erasable.
- [ ] Guard/backstop in place (a bundler plugin, or `server-only` on RSC stacks) [2].
- [ ] Migrated: server runtime deps live in the package, not the app; app imports
      only types; project references wired [5].

## Sources

1. Client-Side Clients - oRPC: https://orpc.dev/docs/client/client-side
2. Optimize Server-Side Rendering (SSR) - oRPC: https://orpc.dev/docs/best-practices/optimize-ssr
3. RPC Handler - oRPC: https://orpc.dev/docs/rpc-handler
4. CORS Plugin - oRPC: https://orpc.dev/docs/plugins/cors
5. Monorepo Setup - oRPC: https://orpc.dev/docs/best-practices/monorepo-setup
6. Contract-first, Define Contract - oRPC: https://orpc.dev/docs/contract-first/define-contract
