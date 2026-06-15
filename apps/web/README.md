# `@template/web`

Solid SPA for the full-stack oRPC template.

## Commands

```sh
pnpm --dir apps/web run dev
pnpm --dir apps/web run build
pnpm --dir apps/web run check
```

The shared oRPC client lives in `src/orpc.ts`. It uses a relative `/rpc` URL by
default, so Vite proxies calls to the API during development and the same code
works when the API and SPA are co-hosted.

Set `VITE_API_URL` to call a different API origin:

```sh
VITE_API_URL=http://127.0.0.1:3001 pnpm --dir apps/web run dev
```

Set `VITE_DEV_API_PROXY_TARGET` when the API dev server is running on a
non-default port:

```sh
VITE_DEV_API_PROXY_TARGET=http://127.0.0.1:3011 pnpm --dir apps/web run dev
```
