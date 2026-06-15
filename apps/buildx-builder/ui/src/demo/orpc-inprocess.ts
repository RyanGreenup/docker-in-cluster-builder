/**
 * Single-file oRPC demonstration.
 *
 * The "production" wiring in this repo spreads one service across a separate
 * package (`@rs/buildx-builder-api`), a standalone Node HTTP server
 * (`api/src/server.ts` on port 3001 with the CORS plugin), and a network
 * client in the UI (`RPCLink` + `createORPCClient`). That is the right shape
 * once the API is a real, independently deployed process.
 *
 * This file shows the other end of the spectrum: how little oRPC actually
 * needs. Procedures, their validation, the router, and a fully typed,
 * directly callable client all live here. `createRouterClient` runs the
 * procedures in-process, so there is no second server, no port, no CORS, and
 * no network serialization, yet `api.builds.trigger(...)` keeps the exact same
 * end-to-end type inference you get over the wire. Swap `createRouterClient`
 * for an `RPCLink` later and not a single call site changes.
 *
 * This file is deliberately client-bundled: it lives in `src/demo/` rather than
 * `src/server/`, so the `server-only-guard` plugin in `vite.config.ts` does not
 * apply to it. That guard protects the real production path instead: genuine
 * server code (the `@rs/buildx-builder-api` router, anything under `src/server/`)
 * may be imported into the UI by `import type` only and can never be bundled
 * into the browser. The demo can run server-shaped code in-process precisely
 * because it holds nothing that must stay server-side. The banners below split
 * the file the way a real app would: a client-safe contract and the server-only
 * service that would move under `src/server/`.
 */
import { createRouterClient, ORPCError, os } from '@orpc/server'
import * as zod from 'zod'

// /////////////////////////////////////////////////////////
// CLIENT-SAFE (may live anywhere) /////////////////////////
// /////////////////////////////////////////////////////////
// The shared contract: constants, schemas, and the derived type. Pure data and
// validation with no server state, so they are safe in the browser bundle and
// would normally live in a module imported by both the client and the server.

/** Lowest valid build id; ids count up from here. */
const FIRST_BUILD_ID = 1
/** Minimum tag length so an empty image tag is rejected. */
const TAG_MIN_LENGTH = 1

/** Lifecycle states a build moves through. */
const BuildStatusSchema = zod.enum(['queued', 'running', 'succeeded', 'failed'])

/** A docker buildx build tracked by this demo service. */
const BuildSchema = zod.object({
  id: zod.number().int().min(FIRST_BUILD_ID),
  status: BuildStatusSchema,
  tag: zod.string().min(TAG_MIN_LENGTH),
})

export type Build = zod.infer<typeof BuildSchema>

// /////////////////////////////////////////////////////////
// SERVER ONLY src/server/ /////////////////////////////////
// /////////////////////////////////////////////////////////
// Stateful store, procedures, router, and the in-process client. In a real app
// these would live under `src/server/` (or `@rs/buildx-builder-api`) and the UI
// would reach `router` by `import type` only. The demo keeps them here so the
// whole service runs in-process in the browser; nothing here touches a secret,
// the filesystem, or the network, which is the only reason that is safe.

/** In-memory store standing in for a real build backend. */
const builds: Build[] = []
let nextId = FIRST_BUILD_ID

/** Queue a new build for an image tag and return the created record. */
const triggerBuild = os
  .input(BuildSchema.pick({ tag: true }))
  .handler(({ input }) => {
    const build: Build = { id: nextId, status: 'queued', tag: input.tag }
    nextId += 1
    builds.push(build)
    return build
  })

/** List every build the service has seen, in the order they were triggered. */
const listBuilds = os.handler(() => [...builds])

/** Fetch a single build by id, or fail with NOT_FOUND. */
const findBuild = os
  .input(BuildSchema.pick({ id: true }))
  .handler(({ input }) => {
    const build = builds.find((candidate) => candidate.id === input.id)

    if (!build) {
      throw new ORPCError('NOT_FOUND', {
        message: `No build with id ${input.id}`,
      })
    }

    return build
  })

/** The whole "backend" for this demo: three procedures, one object. */
export const router = {
  builds: {
    find: findBuild,
    list: listBuilds,
    trigger: triggerBuild,
  },
}

/**
 * A fully typed client that calls the router in-process. No HTTP server, no
 * port, no CORS. `api.builds.trigger({ tag: "app:latest" })` is autocompleted
 * and its return type is inferred straight from the handler above.
 */
export const api = createRouterClient(router)
