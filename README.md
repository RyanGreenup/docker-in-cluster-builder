# Full-Stack oRPC Template

A pnpm workspace template for a Solid SPA backed by a Node oRPC API.

## Packages

- `apps/api` exports the oRPC router and runs the HTTP API on port `3001`.
- `apps/web` is a Vite + Solid + TanStack Router app that calls the API through
  `RPCLink`.
- `packages/eslint_config` and `packages/oxlint_config` provide shared lint and
  formatting config.

The web app imports `@template/api` as a type only:

```ts
import type { router } from "@template/api";
```

That keeps procedure handlers and Node-only server code out of the browser
bundle while preserving end-to-end input/output inference.

## Commands

```sh
pnpm install
pnpm run dev
pnpm run build
pnpm run check
```

During development, Vite serves the web app on `http://127.0.0.1:3000` and
proxies `/rpc` to the API at `http://127.0.0.1:3001/rpc`.

## Environment

Set `VITE_API_URL` when the web app should call a different API origin:

```sh
VITE_API_URL=https://api.example.com pnpm --dir apps/web run build
```

Leave it unset for same-origin `/rpc` calls in dev or in a co-hosted production
deployment.

If the default dev ports are busy, run the API on another port and point the
Vite proxy at it:

```sh
PORT=3011 pnpm --dir apps/api run dev
VITE_DEV_API_PROXY_TARGET=http://127.0.0.1:3011 pnpm --dir apps/web run dev -- --port 3010
```
