import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import type { RouterClient } from '@orpc/server'
import type { router } from '@template/api'

const API_URL = import.meta.env.VITE_API_URL ?? ''

const link = new RPCLink({ url: `${API_URL}/rpc` })

/**
 * The typed oRPC client shared across routes. `router` is imported as a type
 * only, so no server code is bundled into the browser: every call goes over
 * HTTP through RPCLink, while the full request/response types are inferred from
 * the server's router. See `docs/orpc-avoiding-cross-bundling.md`.
 */
export const client: RouterClient<typeof router> = createORPCClient(link)
