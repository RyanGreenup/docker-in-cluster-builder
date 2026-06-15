# oRPC + SolidJS Tutorial

This template wires a Solid SPA to a Node oRPC API in a pnpm monorepo.

## Layout

```text
apps/
├── api/
│   └── src/
│       ├── index.ts    # procedures + router value
│       └── server.ts   # HTTP server entry point
└── web/
    └── src/
        ├── orpc.ts     # typed client, router imported as a type only
        └── routes/
            └── index.tsx
```

## Server Procedures

`apps/api/src/index.ts` defines procedures with `@orpc/server` and zod schemas.
The exported `router` is a runtime value containing handlers, so browser code
must never import it as a value.

```ts
export const router = {
  todos: {
    create: createTodo,
    list: listTodos,
    toggle: toggleTodo,
  },
};
```

## HTTP Server

`apps/api/src/server.ts` mounts `RPCHandler` at `/rpc` and keeps `CORSPlugin`
enabled so non-web clients or separate deployments can call the API.

Run it with:

```sh
pnpm --dir apps/api run dev
```

## Web Client

`apps/web/src/orpc.ts` builds the runtime client from `RPCLink` and imports the
router type only:

```ts
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { router } from "@template/api";

const apiUrl = import.meta.env.VITE_API_URL ?? "";
const link = new RPCLink({ url: `${apiUrl}/rpc` });

export const client: RouterClient<typeof router> = createORPCClient(link);
```

The empty default base URL means same-origin `/rpc`. In dev, Vite proxies that
path to `http://127.0.0.1:3001`.

## Solid Data Fetching

Routes can call procedures directly from the typed client:

```tsx
const [todos, { refetch }] = createResource(() => client.todos.list());

await client.todos.create({ title: "Ship the template" });
await refetch();
```

`RouterClient<typeof router>` provides autocomplete and typed inputs/outputs,
while `import type { router }` erases the server implementation from the client
bundle.

## Common Pitfalls

- Use slash-separated paths. With the `/rpc` prefix, `todos.list` is served at
  `/rpc/todos/list`.
- Do not call the RPC handler with hand-written JSON requests. `RPCLink` handles
  oRPC's `{ json, meta }` wire envelope.
- Keep `@orpc/server` usage in `apps/api`, except for type-only imports such as
  `RouterClient` in the web app.
- If a browser build loads a guarded server module, check for a missing
  `import type`.

## Sources

1. Client-Side Clients - oRPC: https://orpc.dev/docs/client/client-side
2. RPC Handler - oRPC: https://orpc.dev/docs/rpc-handler
3. CORS Plugin - oRPC: https://orpc.dev/docs/plugins/cors
4. RPC Protocol - oRPC: https://orpc.dev/docs/advanced/rpc-protocol
5. RPC Link - oRPC: https://orpc.dev/docs/client/rpc-link
