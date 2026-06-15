import { z } from "zod";

/**
 * Shared GitHub Actions-style lifecycle vocabulary, reused at run and step
 * level. `status` tracks where work is in its lifecycle; `conclusion` records
 * how it ended and stays null until status is "completed".
 */
export const Status = z.enum([
  "queued",
  "in_progress",
  "completed",
  "waiting",
  "requested",
  "pending",
]);
export type Status = z.infer<typeof Status>;

export const Conclusion = z.enum([
  "success",
  "failure",
  "cancelled",
  "skipped",
  "timed_out",
  "action_required",
  "neutral",
  "stale",
]);
export type Conclusion = z.infer<typeof Conclusion>;

export const isoDateTime = z.iso.datetime({ offset: true });

/**
 * Reject payloads whose conclusion is inconsistent with their status: a
 * conclusion is required once completed and forbidden before then.
 * @param value - The run or step being validated.
 * @param ctx - Zod refinement context used to report issues.
 */
export const enforceConclusionRule = <
  Payload extends { status: Status; conclusion: Conclusion | null },
>(
  value: Payload,
  ctx: z.RefinementCtx,
): void => {
  if (value.status === "completed" && value.conclusion === null) {
    ctx.addIssue({
      code: "custom",
      message: "conclusion must be set once status is 'completed'",
      path: ["conclusion"],
    });
  }
  if (value.status !== "completed" && value.conclusion !== null) {
    ctx.addIssue({
      code: "custom",
      message: "conclusion must be null until status is 'completed'",
      path: ["conclusion"],
    });
  }
};
