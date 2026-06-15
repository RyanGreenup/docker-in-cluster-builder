# Co-hosting The SPA And oRPC API

The default dev setup runs two processes:

- `apps/web`: Vite on port `3000`
- `apps/api`: oRPC HTTP server on port `3001`, mounted at `/rpc`

Vite proxies `/rpc` to the API, so browser code can use a relative `/rpc` URL in
development and production.

## Production Option: One Node Server

The API server can serve the built SPA and oRPC from one origin:

1. Build the SPA: `pnpm --dir apps/web run build`.
2. Add a small static server such as `sirv` to `apps/api`.
3. Let `RPCHandler` handle `/rpc` first; serve static files on misses.

Skeleton:

```ts
const result = await handler.handle(req, res, {
  prefix: "/rpc",
  context: { headers: req.headers },
});

if (result.matched) {
  return;
}

serveStatic(req, res);
```

Keep `CORSPlugin` enabled if native apps, previews, or other origins need to
call the API.

## Client URL

`apps/web/src/orpc.ts` uses:

```ts
const apiUrl = import.meta.env.VITE_API_URL ?? "";
const link = new RPCLink({ url: `${apiUrl}/rpc` });
```

- Unset `VITE_API_URL`: same-origin `/rpc`.
- Set `VITE_API_URL=https://api.example.com`: cross-origin
  `https://api.example.com/rpc`.

## Development Proxy

`apps/web/vite.config.ts` contains:

```ts
const API_PROXY_TARGET =
  process.env.VITE_DEV_API_PROXY_TARGET ?? "http://127.0.0.1:3001";

server: {
  proxy: { "/rpc": API_PROXY_TARGET },
}
```

This keeps browser requests same-origin in dev while the API still runs as a
separate process.

## Sources

1. HTTP Adapter - oRPC: https://orpc.dev/docs/adapters/http
2. CORS Plugin - oRPC: https://orpc.dev/docs/plugins/cors
3. Vite Server Options: https://vite.dev/config/server-options
