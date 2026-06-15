# Tutorial: co-hosting the SPA and the oRPC API

By default this repo runs two processes: the Vite SPA (port 3000) and the oRPC
API (port 3001), with CORS bridging them. That is fine, but a single origin is
more convenient to deploy and to reason about. This tutorial shows two ways to
serve the SPA and the API together, **keeping CORS enabled** so cross-origin
clients (Capacitor native builds, other apps) keep working.

- Option 2 first: one server serves the built SPA and mounts the oRPC handler at
  `/rpc`. Framework-agnostic, keeps the pure Vite SPA, smallest change.
- Option 1 next: TanStack Start hosts the handler on a server route so the same
  dev/prod server serves both.

CORS stays on in both: co-hosting just makes the **web** client same-origin,
while **native/Capacitor** clients still call the API cross-origin and rely on
the CORS headers [3].

## Background: what stays the same

Co-hosting changes only _where requests are served from_, not the cross-bundling
story. The client still builds its client from a transport link and imports the
router as a type only, so no server code is bundled [1][4]:

```ts
import type { router } from "@rs/buildx-builder-api";
const client: RouterClient<typeof router> = createORPCClient(link);
```

What changes is the link's `url` (same origin instead of `http://127.0.0.1:3001`)
and which process answers it.

> [!NOTE]
> **Co-hosting serves oRPC's own wire format; that is a format point, not a
> licensing one.** oRPC is free and open source (MIT [7]). Whether you host the
> handler on a second port, behind a `/rpc` prefix, or on a framework route, the
> bytes on the wire are oRPC's RPC protocol (a `{ json, meta }` envelope, not plain
> JSON), so clients must use `RPCLink`. If you need a standards-based wire at the
> same origin, mount oRPC's OpenAPI handler instead of (or beside) the RPC handler.

## Option 2: one server serves the SPA + `/rpc`

The oRPC Node handler reports whether a request `matched` a procedure; on a miss
you serve static files. That is the documented co-hosting pattern [2].

### 2.1 Build the SPA

```sh
pnpm --dir apps/buildx-builder/ui run build   # outputs apps/buildx-builder/ui/dist
```

### 2.2 Serve static assets + the handler from one process

Extend the existing server (`apps/buildx-builder/api/src/server.ts`). Use a tiny
static server for the SPA assets with an SPA fallback (serve `index.html` for
unknown client routes); `sirv` is a small, dependency-light choice, but a manual
`node:fs` reader works too.

```ts
// apps/buildx-builder/api/src/server.ts
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/node";
import { CORSPlugin } from "@orpc/server/plugins";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sirv from "sirv";

import { router } from "./index";

const PORT = 3001;
const RPC_PREFIX = "/rpc";

const handler = new RPCHandler(router, {
  interceptors: [onError((error) => console.error(error))],
  plugins: [new CORSPlugin()], // keep CORS for cross-origin (Capacitor) clients
});

// Built SPA lives in the ui package; `single: true` enables index.html fallback.
const spaDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../ui/dist",
);
const serveStatic = sirv(spaDir, { single: true, gzip: true });

const server = createServer(async (req, res) => {
  const { matched } = await handler.handle(req, res, {
    prefix: RPC_PREFIX,
    context: { headers: req.headers },
  });
  if (matched) return; // an oRPC procedure handled it

  serveStatic(req, res, () => {
    res.statusCode = 404;
    res.end("Not found");
  });
});

server.listen(PORT, "0.0.0.0", () =>
  console.log(`SPA + oRPC on http://localhost:${PORT} (rpc at ${RPC_PREFIX})`),
);
```

Notes:

- `prefix: '/rpc'` namespaces the API so it never collides with SPA routes [2].
- Binding `0.0.0.0` (not `127.0.0.1`) lets a device or emulator reach it; keep
  `127.0.0.1` if you only serve localhost.
- `CORSPlugin` stays so native clients on another origin still work [3].
- Add `sirv` to the api package: `pnpm --dir apps/buildx-builder/api add sirv`.

### 2.3 Make the client URL origin-aware

The web client should target the same origin in production; native clients need
an explicit base URL (their origin is a `capacitor://`/`file://` scheme, not your
API). Drive it from config/env:

```ts
// apps/buildx-builder/ui/src/orpc.ts
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { router } from "@rs/buildx-builder-api";

// Native builds set VITE_API_URL to the deployed API origin; web uses same origin.
const apiBase = import.meta.env.VITE_API_URL ?? ""; // '' => relative, same origin
const link = new RPCLink({ url: `${apiBase}/rpc` });

export const client: RouterClient<typeof router> = createORPCClient(link);
```

In production the SPA is served by the Node server above, so a relative `/rpc`
hits the same origin (no CORS needed for web). A Capacitor build sets
`VITE_API_URL=https://api.example.com`, calls cross-origin, and the `CORSPlugin`
allows it [3].

### 2.4 Keep dev pleasant (same-origin in dev too)

In dev the SPA is still served by Vite on port 3000, so a relative `/rpc` would
hit Vite, not the API. Proxy it. There is no oRPC-specific Vite plugin; Vite's
built-in proxy is enough:

```ts
// apps/buildx-builder/ui/vite.config.ts -> defineConfig({ ... })
server: {
  proxy: { '/rpc': 'http://127.0.0.1:3001' },
},
```

Now `/rpc` is same-origin in both dev (Vite forwards to the API) and prod (one
server). Run the API with `pnpm --dir apps/buildx-builder/api run dev` and the
UI with `pnpm --dir apps/buildx-builder/ui run dev`. (See Vite server options for
the proxy [5].)

### 2.5 Result

One deployable artifact in production: the Node process serves the SPA and the
API on a single origin, CORS still available for native clients. The SPA stays a
plain Vite build, and the cross-bundling guard is unchanged because the client
still imports the router as a type only [1].

## Option 1: TanStack Start hosts the handler on a route

TanStack Start is the server-capable superset of TanStack Router (already used
here). oRPC has a first-class adapter: define a server route and mount the
handler, and the same Start server serves the SPA and the API [6].

```ts
// apps/buildx-builder/ui/src/routes/api/rpc.$.ts
import { createFileRoute } from "@tanstack/solid-router";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { CORSPlugin } from "@orpc/server/plugins";

import { router } from "@rs/buildx-builder-api";

const handler = new RPCHandler(router, {
  interceptors: [onError((error) => console.error(error))],
  plugins: [new CORSPlugin()], // keep CORS for cross-origin (Capacitor) clients
});

export const Route = createFileRoute("/api/rpc/$")({
  server: {
    handlers: {
      ANY: async ({ request }) => {
        const { response } = await handler.handle(request, {
          prefix: "/api/rpc",
          context: {},
        });
        return response ?? new Response("Not Found", { status: 404 });
      },
    },
  },
});
```

Client points at the same origin (relative for web, explicit base for native) [6]:

```ts
const apiBase = import.meta.env.VITE_API_URL ?? "";
const link = new RPCLink({ url: `${apiBase}/api/rpc` });
```

### Is Start "too much machinery for a mere SPA"?

For a genuinely static SPA, yes, Start adds a server runtime and a server
deployment target you would not otherwise need. But once you have an oRPC API you
are not a mere SPA, you are an SPA plus an API, and Start consolidates those two
servers into one runtime, which is arguably _less_ moving machinery than Option 2
plus a separate API process. The real trade is that you swap static-file hosting
(a CDN bucket) for a server deployment; if you already deploy the API as a
server, that trade is close to free.

### Cross-bundling caveat under Start

Two repo-specific notes. First, this codebase's own notes flag that
`verbatimModuleSyntax` "has issues with TanStack Start"; that flag matters
because our guard relies on `verbatimModuleSyntax` to make type-only imports
explicit and erasable, so verify it before relying on the guard. Second, under
Start the server route file is server-only by the framework's own client/server
build split, so the cross-bundling boundary shifts from our Vite plugin to the
framework. Importing `router` as a value into a client component is what you must
still avoid; keep the type-only discipline, and treat the guard plugin as a
backstop [1][4].

## Which to choose

- Keep the pure SPA, smallest change, deploy flexibility (static + one API
  server, or one combined Node server): **Option 2**.
- Want one integrated server and you are comfortable adopting the framework
  (and have verified the `verbatimModuleSyntax` interaction): **Option 1**.

Both keep CORS, so Capacitor and other cross-origin clients work either way; the
only difference is that the web client becomes same-origin.

## Sources

1. Client-Side Clients - oRPC: https://orpc.dev/docs/client/client-side
2. HTTP adapter - oRPC: https://orpc.dev/docs/adapters/http
3. CORS Plugin - oRPC: https://orpc.dev/docs/plugins/cors
4. Optimize Server-Side Rendering (SSR) - oRPC: https://orpc.dev/docs/best-practices/optimize-ssr
5. Vite server options (proxy): https://vite.dev/config/server-options
6. TanStack Start Adapter - oRPC: https://orpc.dev/docs/adapters/tanstack-start
7. oRPC license (MIT) - unnoq/orpc: https://github.com/unnoq/orpc/blob/main/LICENSE
