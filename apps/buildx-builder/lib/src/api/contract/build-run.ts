import { z } from "zod";

import { Conclusion, enforceConclusionRule, isoDateTime, Status } from "./lifecycle";

// One step of a build run (here, the buildx invocation itself).
export const BuildStep = z
  .object({
    completed_at: isoDateTime.nullable(),
    conclusion: Conclusion.nullable(),
    name: z.string(),
    number: z.number().int().positive(),
    started_at: isoDateTime.nullable(),
    status: Status,
  })
  .superRefine(enforceConclusionRule);
export type BuildStep = z.infer<typeof BuildStep>;

// The record returned when a build is triggered, adapted from a GitHub run.
export const BuildRun = z
  .object({
    conclusion: Conclusion.nullable(),
    created_at: isoDateTime,
    event: z.string(),
    head_ref: z.string(),
    head_sha: z.string(),
    id: z.number().int(),
    run_started_at: isoDateTime.nullable(),
    status: Status,
    steps: z.array(BuildStep),
    tag: z.string(),
    updated_at: isoDateTime,
  })
  .superRefine(enforceConclusionRule);
export type BuildRun = z.infer<typeof BuildRun>;
