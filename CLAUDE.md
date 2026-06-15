# Full-Stack oRPC Template - Project Conventions

## Stack

- Package manager: pnpm workspaces.
- Web: Vite, Solid, TanStack Router.
- API: Node HTTP server with oRPC.
- Build: `tsdown` for the API, Vite for the web app.
- Tests: `vitest`.
- Type checking: `tsgo --skipLibCheck --noEmit`.
- Lint/format: `oxlint`, `oxfmt`, ESLint, and Prettier.

## Project Structure

```text
fullstack-orpc-template/
├── apps/api/       # oRPC procedures, router, and HTTP server
├── apps/web/       # Solid SPA and typed oRPC client
└── packages/       # shared lint and formatting config
```

## Boundaries

- Keep procedure handlers and Node-only code in `apps/api`.
- The web app may import API exports as types only.
- The web app talks to the API through `RPCLink` at `/rpc`.
- Add new server-only packages to `serverOnlyGuard` in `apps/web/vite.config.ts`.

## Verification

Run `pnpm run check` after code changes.
