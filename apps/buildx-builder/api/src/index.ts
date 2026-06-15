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

/** Lowest valid build id; ids count up from here. */
const FIRST_BUILD_ID = 1;
/** Minimum tag length so an empty image tag is rejected. */
const TAG_MIN_LENGTH = 1;

/** Lifecycle states a build moves through. */
const BuildStatusSchema = zod.enum(["queued", "running", "succeeded", "failed"]);

/** A docker buildx build tracked by the service. */
const BuildSchema = zod.object({
  id: zod.number().int().min(FIRST_BUILD_ID),
  status: BuildStatusSchema,
  tag: zod.string().min(TAG_MIN_LENGTH),
});

export type Build = zod.infer<typeof BuildSchema>;

/** In-memory store standing in for a real build backend. */
const builds: Build[] = [];

/** Queue a new build for an image tag and return the created record. */
export const triggerBuild = os.input(BuildSchema.pick({ tag: true })).handler(({ input }) => {
  const build: Build = {
    id: builds.length + FIRST_BUILD_ID,
    status: "queued",
    tag: input.tag,
  };
  builds.push(build);
  return build;
});

/** List every build the service has seen, in the order they were triggered. */
export const listBuilds = os.handler(() => [...builds]);

/** Fetch a single build by id, or fail with NOT_FOUND. */
export const findBuild = os.input(BuildSchema.pick({ id: true })).handler(({ input }) => {
  const build = builds.find((candidate) => candidate.id === input.id);

  if (!build) {
    throw new ORPCError("NOT_FOUND", {
      message: `No build with id ${input.id}`,
    });
  }

  return build;
});

export const router = {
  builds: {
    find: findBuild,
    list: listBuilds,
    trigger: triggerBuild,
  },
  planet: {
    create: createPlanet,
    find: findPlanet,
    list: listPlanet,
  },
};
