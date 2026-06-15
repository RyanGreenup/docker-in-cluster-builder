import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import type { RouterClient } from '@orpc/server'
import type { router } from '@rs/buildx-builder-api'

/** Base URL for the oRPC API server (see `apps/buildx-builder/api`). */
const API_URL = 'http://127.0.0.1:3001'

const link = new RPCLink({ url: API_URL })

/**
 * The typed oRPC client shared across routes. `router` is imported as a type
 * only, so no server code is bundled into the browser: every call goes over
 * HTTP through RPCLink, while the full request/response types are inferred from
 * the server's router. See `docs/orpc-avoiding-cross-bundling.md`.
 */
export const client: RouterClient<typeof router> = createORPCClient(link)
