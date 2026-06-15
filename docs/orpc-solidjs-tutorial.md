# oRPC + SolidJS: End-to-End Type-Safe RPC Tutorial

> **Reference architecture** for wiring an oRPC server to a SolidJS frontend in a pnpm monorepo.
> Covers server definitions, client creation, SolidJS data fetching, and `turbo dev` orchestration.

---

## Project Layout

```
apps/buildx-builder/
├── api/src/
│   ├── index.ts        # Library entry: procedures + router (NO server code)
│   └── server.ts       # Standalone HTTP server entry point
└── ui/src/
    └── routes/
        └── index.tsx   # SolidJS route consuming the API
```

**Key boundary**: Library entry (`index.ts`) exports only type-safe definitions. The HTTP
server is a separate file that imports the router. This prevents side-effects when the UI
imports `@rs/buildx-builder-api`.

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
- Import `zod` as `* as zod` — the alias must be ≥ 2 chars for oxlint `id-length`.
- Unused handler params get `_` prefix: `({ input: _input })`.
- Return plain data — oRPC serializes automatically.

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

- `RPCHandler` wraps the router and provides the HTTP adapter.
- `CORSPlugin` enables cross-origin requests from the Vite dev server.
- `onError` interceptor catches all procedure errors for logging.
- Port **3001** — choose a port that doesn't conflict with the Vite dev server (usually 3000).

### URL format

The RPC protocol uses **slash-separated procedure paths**:

```
POST /planet/list          # calls router.planet.list
POST /planet/find          # calls router.planet.find
GET  /planet/list?data=%7B%22cursor%22%3A0%7D   # GET variant
```

⚠️ The procedure name uses `/` slashes, **not** `.` dots. `toHttpPath(["planet","list"])`
returns `/planet/list`, so that's what the matcher expects.

---

## Step 3 — Client: ORPC Client Setup

```tsx
// apps/buildx-builder/ui/src/routes/index.tsx
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { router } from "@rs/buildx-builder-api";

const link = new RPCLink({ url: "http://127.0.0.1:3001" });
const orpc: RouterClient<typeof router> = createORPCClient(link);
```

### Key points

- `RPCLink` handles the RPC protocol (serialization, URL construction).
- `RouterClient<typeof router>` gives full type safety — `orpc.planet.list()` is
  autocompleted and typed from the server definition.
- The URL **must not** include a `/rpc` prefix unless the server also configures one
  (via `prefix` option in `RPCHandler`).
- `@orpc/server` must be a dependency of the UI package (for the `RouterClient` type).

---

## Step 4 — Client: SolidJS Data Fetching

```tsx
import { createResource, For, Show } from "solid-js";

async function fetchPlanets() {
  return orpc.planet.list({ cursor: 0 });
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

ORPC uses its own wire format (not raw JSON). The `RPCLink` client handles serialization
automatically — `curl` testing requires the correct serialization wrapper, which is why
direct curl calls often produce deserialization errors. Use the ORPC client for integration
testing.

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
       └──► Client (ui/src/routes/index.tsx)
              └─ RouterClient<typeof router>  ← full type inference
              └─ RPCLink({ url: "http://127.0.0.1:3001" })
              └─ orpc.planet.list({ cursor: 0 })  ← autocompleted, typed
```

The `typeof router` type flows from the server definition through `RouterClient<typeof router>`
into the client, giving autocomplete on procedure names and typed inputs/outputs.
