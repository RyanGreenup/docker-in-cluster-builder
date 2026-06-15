import { ORPCError, os } from "@orpc/server";
import * as zod from "zod";

import type { IncomingHttpHeaders } from "node:http";

/** Initial Id Value used for early iteration */
const INITIAL_ID_VALUE = 1;

/** Minimum cursor value for pagination */
const CURSOR_MIN = 0;
/** Default cursor value when none is provided */
const CURSOR_DEFAULT = 0;
/** Minimum items per page */
const LIMIT_MIN = 1;
/** Maximum items per page */
const LIMIT_MAX = 100;

const PlanetSchema = zod.object({
  description: zod.string().optional(),
  id: zod.number().int().min(INITIAL_ID_VALUE),
  name: zod.string(),
});

export const listPlanet = os
  .input(
    zod.object({
      cursor: zod.number().int().min(CURSOR_MIN).default(CURSOR_DEFAULT),
      limit: zod.number().int().min(LIMIT_MIN).max(LIMIT_MAX).optional(),
    }),
  )
  .handler(({ input: _input }) => [{ id: 1, name: "name" }]);

export const findPlanet = os
  .input(PlanetSchema.pick({ id: true }))
  .handler(({ input: _input }) => [{ id: 1, name: "name" }]);

export const createPlanet = os
  .$context<{ headers: IncomingHttpHeaders }>()
  .use(({ context: _context, next }) => {
    /**
     * Check Auth
     *
     *  ```ts
     *  const user = parseJWT(_context.headers.authorization?.split(" ")[1]);
     * ```
     **/
    const user = { id: "1234", name: "John Doe" };

    if (user) {
      return next({ context: { user } });
    }

    throw new ORPCError("UNAUTHORIZED");
  })
  .input(PlanetSchema.omit({ id: true }))
  .handler(({ input: _input, context: _context }) => [{ id: 1, name: "name" }]);

export const router = {
  planet: {
    create: createPlanet,
    find: findPlanet,
    list: listPlanet,
  },
};
