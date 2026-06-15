# oRPC + SolidJS: End-to-End Type-Safe RPC Tutorial

> **Reference architecture** for wiring an oRPC server to a SolidJS frontend in a pnpm monorepo.
> Covers server definitions, client creation, SolidJS data fetching, and `turbo dev` orchestration.

---

## Project Layout

```
apps/buildx-builder/
├── api/src/
│   ├── index.ts        # procedures + router (a runtime VALUE: the handlers)
│   └── server.ts       # standalone HTTP server entry point
└── ui/src/
    ├── orpc.ts         # shared typed client (imports the router TYPE only)
    └── routes/
        └── index.tsx   # SolidJS route consuming the client
```

**Key boundary**: `index.ts` exports the procedures and the `router`. The `router` is a
runtime value that contains the handlers, so it is server code, not "just types". The UI
must therefore import it as a **type only** (`import type { router }`), which is erased at
compile time so no server code is bundled into the browser [1]. Splitting the HTTP entry
into `server.ts` only keeps the `listen()` side effect out of `index.ts`; it does not make
`index.ts` safe to *value*-import. See
[orpc-avoiding-cross-bundling.md](./orpc-avoiding-cross-bundling.md) for the full reasoning.

---

## Step 1 — Server: Define Procedures

```ts
// apps/buildx-builder/api/src/index.ts
import { ORPCError, os } from "@orpc/server";
import * as zod from "zod";

const PlanetSchema = zod.object({
  description: zod.string().optional(),
  id: zod.number().int().min(1),
  name: zod.string(),
});

export const listPlanet = os
  .input(
    zod.object({
      cursor: zod.number().int().min(0).default(0),
      limit:  zod.number().int().min(1).max(100).optional(),
    }),
  )
  .handler(({ input: _input }) => [{ id: 1, name: "Earth" }]);

export const findPlanet = os
  .input(PlanetSchema.pick({ id: true }))
  .handler(({ input: _input }) => [{ id: 1, name: "Earth" }]);

export const router = {
  planet: {
    list: listPlanet,
    find: findPlanet,
  },
};
```

### Key points

- Use `os` builder from `@orpc/server` for each procedure.
- Zod schemas define input validation. Use named constants for magic numbers
  (oxlint `no-magic-numbers` requires it).
- Import `zod` as `* as zod`: the alias must be at least 2 chars for oxlint `id-length`.
- Unused handler params get `_` prefix: `({ input: _input })`.
- Return plain data: the RPC handler serializes it over oRPC's protocol [2].
- The exported `router` is a runtime value (the handlers): consume it from the
  client as a **type only** so server code never reaches the browser [1].

---

## Step 2 — Server: HTTP Entry Point

```ts
// apps/buildx-builder/api/src/server.ts
import { createServer } from "node:http";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/node";
import { CORSPlugin } from "@orpc/server/plugins";
import { router } from "./index";

const handler = new RPCHandler(router, {
  interceptors: [onError((error) => console.error(error))],
  plugins: [new CORSPlugin()],
});

const server = createServer(async (req, res) => {
  const result = await handler.handle(req, res, {
    context: { headers: req.headers },
  });
  if (!result.matched) {
    res.statusCode = 404;
    res.end("No procedure matched");
  }
});

server.listen(3001, "127.0.0.1", () =>
  console.log("oRPC server listening on http://127.0.0.1:3001"),
);
```

### Key points

- `RPCHandler` speaks oRPC's own RPC protocol over HTTP (specific to oRPC, not a
  neutral standard) and is built for `RPCLink`; it does not serve OpenAPI, and you
  should not craft requests to it by hand [2]. It serializes native types (Date,
  BigInt, Map, Set, etc.), so the wire format is not plain JSON [2].

> [!NOTE]
> **"Proprietary" here is a wire-format point, not a licensing one.** oRPC itself
> is free and open source (MIT licensed [7]), so there is no vendor lock-in: you
> can read, fork, or reimplement it [6]. What is "proprietary" is only the RPC wire
> format. It is specific to oRPC (a `{ json, meta }` envelope, not a neutral
> standard like JSON-RPC or plain JSON), so a generic JSON/HTTP client cannot call
> it directly; use `RPCLink`. If you need a standards-based wire for third-party or
> non-TypeScript consumers, expose oRPC's OpenAPI handler instead [2].
- `CORSPlugin` configures cross-origin requests [3]; in this setup that is needed
  for the Vite dev server (different port) and for cross-origin clients such as
  Capacitor builds.
- `onError` interceptor catches all procedure errors for logging.
- Port **3001**: choose a port that does not conflict with the Vite dev server (usually 3000).

### URL format

Procedure paths are slash-separated; with no `prefix` set, `router.planet.list`
is reached at `/planet/list`, and with `prefix: '/rpc'` at `/rpc/planet/list` [4]:

```
POST /planet/list          # input travels in the request body
POST /planet/find
```

By default `RPCLink` uses `POST` and sends the input in the body; `GET` is opt-in
per call via the link's `method` option for read-style calls, where the input is
URL-encoded into a `data` query parameter [5][4]. The path uses `/` slashes,
never `.` dots.

---

## Step 3 — Client: ORPC Client Setup

Define the client once in a shared module and reuse it across routes:

```ts
// apps/buildx-builder/ui/src/orpc.ts
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { router } from "@rs/buildx-builder-api"; // TYPE ONLY

const link = new RPCLink({ url: "http://127.0.0.1:3001" });

export const client: RouterClient<typeof router> = createORPCClient(link);
```

### Key points

- `RPCLink` handles the RPC protocol: serialization and URL construction [5].
- `RouterClient<typeof router>` gives full type safety: `client.planet.list()` is
  autocompleted and typed from the server definition [1].
- `router` and `RouterClient` are imported with `import type`, so they are erased and
  no server code is bundled into the browser [1].
- The link URL **must not** include a `/rpc` prefix unless the server also configures
  one (via the `prefix` option in `RPCHandler`); paths are otherwise served from the
  root, e.g. `/planet/list` [4].
- `@orpc/server` is needed only for the `RouterClient` **type**; the value runtime is
  never imported into the client.

---

## Step 4 — Client: SolidJS Data Fetching

```tsx
// apps/buildx-builder/ui/src/routes/index.tsx
import { createResource, For, Show } from "solid-js";

import { client } from "../orpc";

async function fetchPlanets() {
  return client.planet.list({ cursor: 0 });
}

function Home() {
  const [planets] = createResource(fetchPlanets);

  return (
    <Show when={!planets.loading} fallback={<p>Loading…</p>}>
      <Show when={!planets.error} fallback={<p>Error: {planets.error.message}</p>}>
        <ul>
          <For each={planets()}>
            {(planet) => <li>{planet.name} (id: {planet.id})</li>}
          </For>
        </ul>
      </Show>
    </Show>
  );
}
```

### Key points

- `createResource(fetchPlanets)` triggers the fetch once and tracks loading/error state.
- `<Show when={!planets.loading}>` gates content behind load completion.
- `<Show when={!planets.error}>` handles error state with a fallback `role="alert"`.
- `<For each={planets()}>` renders the array — note `planets()` is a signal getter.
- The returned data is fully typed — `planet.name` and `planet.id` are known to TS.

---

## Step 5 — Package Scripts

### API `package.json`

```json
{
  "scripts": {
    "dev": "tsdown --watch & tsx src/server.ts"
  }
}
```

- `tsdown --watch` builds the library on file changes.
- `tsx src/server.ts` runs the HTTP server directly from TypeScript source.
- `&` backgrounds the build watcher so both run concurrently.
- Add `tsx` as a devDependency.

### UI `package.json`

```json
{
  "dependencies": {
    "@orpc/client": "^1.14.6",
    "@orpc/server": "^1.14.6",
    "@rs/buildx-builder-api": "workspace:*"
  }
}
```

- `@orpc/server` is needed for the `RouterClient` type import.
- `@rs/buildx-builder-api` links to the local API package via pnpm workspace.

---

## Step 6 — Turbo Orchestration

```jsonc
// turbo.json
{
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

Run with:

```sh
pnpm run dev    # or: turbo dev
```

This starts **all** `dev` scripts across the workspace in parallel:

| Package | What runs |
|---|---|
| `api` | `tsdown --watch` + `tsx src/server.ts` (port 3001) |
| `ui` | `vite dev --port 3000` |
| `lib`, `cli`, `core-service` | `tsdown --watch` |

---

## Common Pitfalls

### Port conflicts

If Vite tries port 3000 but it's busy, it auto-increments to 3001, 3002, etc.
Keep the API server on a fixed port (3001) and Vite on 3000 so they never collide.

### "No procedure matched"

- Check the URL uses `/` slashes between path segments: `/planet/list` not `/planet.list`.
- Verify the server's `RPCHandler` has no `prefix` option set, and the client's `RPCLink`
  URL has no trailing `/rpc`.
- If using a prefix, both client URL and server `prefix` must match.

### Validation errors (400 Bad Request)

oRPC uses its own wire format, not raw JSON: the body (or the GET `data` query param) is a
`{ json, meta }` envelope where `meta` carries type hints for values like `Date` [2][4].
`RPCLink` builds this automatically, so direct `curl` calls fail unless they reproduce the
envelope, and the handler is meant for `RPCLink` rather than manual requests [2]. Use the
oRPC client for integration testing.

### Import errors in UI

- `@orpc/server` must be a direct dependency of the UI package (pnpm strict mode blocks
  transitive imports).
- `@rs/buildx-builder-api` must be in the pnpm workspace and listed in UI dependencies.

### Lint: No magic numbers

Always extract numeric literals in schema definitions to named constants:

```ts
const CURSOR_MIN = 0;         // instead of .min(0)
const LIMIT_MAX = 100;        // instead of .max(100)
```

---

## Type Flow Diagram

```
Server (api/src/index.ts)
  └─ define procedures with zod schemas
  └─ export router = { planet: { list, find } }
       │
       ├──► Server (api/src/server.ts)
       │      └─ new RPCHandler(router)
       │      └─ HTTP server on :3001
       │
       └──► Client (ui/src/orpc.ts, consumed by routes)
              └─ import type { router }            (type only, erased)
              └─ RouterClient<typeof router>       (full type inference)
              └─ RPCLink({ url: "http://127.0.0.1:3001" })
              └─ client.planet.list({ cursor: 0 }) (autocompleted, typed)
```

The `typeof router` type flows from the server definition through `RouterClient<typeof router>`
into the client, giving autocomplete on procedure names and typed inputs/outputs. Because the
import is type-only, this inference carries no server code into the bundle [1].

---

## Sources

1. Client-Side Clients - oRPC: https://orpc.dev/docs/client/client-side
2. RPC Handler - oRPC: https://orpc.dev/docs/rpc-handler
3. CORS Plugin - oRPC: https://orpc.dev/docs/plugins/cors
4. RPC Protocol - oRPC: https://orpc.dev/docs/advanced/rpc-protocol
5. RPC Link - oRPC: https://orpc.dev/docs/client/rpc-link
6. oRPC license (MIT) - unnoq/orpc: https://github.com/unnoq/orpc/blob/main/LICENSE
