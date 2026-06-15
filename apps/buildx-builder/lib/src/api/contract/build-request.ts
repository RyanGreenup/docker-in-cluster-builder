import { z } from "zod";

const MIN_STRING_LENGTH = 1;

// Docker build inputs, mirroring the BuildOptions accepted by buildImage.
export const BuildInputs = z.object({
  cacheRef: z.string().min(MIN_STRING_LENGTH).optional(),
  contextDir: z.string().min(MIN_STRING_LENGTH),
  dockerfile: z.string().min(MIN_STRING_LENGTH).optional(),
  push: z.boolean().default(false),
  tag: z.string().min(MIN_STRING_LENGTH),
  timeout: z.number().int().positive().optional(),
});
export type BuildInputs = z.infer<typeof BuildInputs>;

// A request to trigger a build, shaped loosely like a GitHub workflow dispatch.
export const BuildRequest = z.object({
  event: z.string().min(MIN_STRING_LENGTH).default("workflow_dispatch"),
  inputs: BuildInputs,
  ref: z.string().min(MIN_STRING_LENGTH),
  sha: z.string().min(MIN_STRING_LENGTH),
});
export type BuildRequest = z.infer<typeof BuildRequest>;
export type BuildRequestInput = z.input<typeof BuildRequest>;
