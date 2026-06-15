# Adding oRPC Procedures

This template keeps server implementation in `apps/api` and browser code in
`apps/web`. The web app consumes API types only and calls procedures over HTTP.

## Add A Procedure

1. Define a zod schema and handler in `apps/api/src/index.ts`.
2. Export the procedure from the `router`.
3. Call it from `apps/web/src/routes/*` through `client` from `src/orpc.ts`.

Example shape:

```ts
const ItemSchema = zod.object({
  id: zod.number().int().min(1),
  name: zod.string().min(1),
});

export const listItems = os.handler(() => items);

export const router = {
  items: {
    list: listItems,
  },
};
```

Then in the web app:

```ts
const [items] = createResource(() => client.items.list());
```

## Boundary Rules

- `apps/api/src/index.ts` exports a router value that contains handlers.
- `apps/web/src/orpc.ts` imports that router with `import type` only.
- `RPCLink` is the only runtime connection between web and API.
- `serverOnlyGuard` in `apps/web/vite.config.ts` catches accidental value
  imports of server modules during browser builds.

## When To Add Packages

Start with procedures in `apps/api`. If the project grows, add a separate
contract package with `@orpc/contract` so the web app depends on contracts and
schemas only, while `apps/api` implements the handlers.

## Checklist

- [ ] Procedure inputs are validated with zod.
- [ ] Procedure is included under `router`.
- [ ] Web code imports API symbols as types only.
- [ ] New server-only packages are listed in `serverOnlyGuard`.
- [ ] Vite proxy and API handler agree on the `/rpc` prefix.

## Sources

1. Client-Side Clients - oRPC: https://orpc.dev/docs/client/client-side
2. Optimize Server-Side Rendering - oRPC: https://orpc.dev/docs/best-practices/optimize-ssr
3. Monorepo Setup - oRPC: https://orpc.dev/docs/best-practices/monorepo-setup
4. Contract-first, Define Contract - oRPC: https://orpc.dev/docs/contract-first/define-contract
