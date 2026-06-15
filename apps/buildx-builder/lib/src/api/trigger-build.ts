import { buildImage, type BuildOptions } from "../buildx/build";
import { BuildRequest, type BuildRequestInput, BuildRun, type Conclusion } from "./contract";

const BUILD_STEP_NUMBER = 1;

const defaultNow = (): Date => new Date();
const defaultRunId = (): number => Date.now();

/** Injectable collaborators, defaulted for production and overridable in tests. */
export interface TriggerBuildDeps {
  build?: (options: BuildOptions) => Promise<void>;
  now?: () => Date;
  runId?: () => number;
}

/** Outcome of running the buildx step: a CI conclusion and any error message. */
interface StepOutcome {
  conclusion: Conclusion;
  error?: string;
}

const errorMessage = (cause: unknown): string => {
  if (cause instanceof Error) {
    return cause.message;
  }
  return String(cause);
};

/**
 * Run the buildx job, mapping success or thrown errors to a CI conclusion.
 * @param build - The build runner to invoke.
 * @param inputs - Validated docker build inputs.
 * @returns The conclusion, plus the error message when the build failed.
 */
const runBuildStep = async (
  build: (options: BuildOptions) => Promise<void>,
  inputs: BuildRequest["inputs"],
): Promise<StepOutcome> => {
  try {
    await build({
      cacheRef: inputs.cacheRef,
      contextDir: inputs.contextDir,
      dockerfile: inputs.dockerfile,
      push: inputs.push,
      tag: inputs.tag,
      timeout: inputs.timeout,
    });
    return { conclusion: "success" };
  } catch (error) {
    return { conclusion: "failure", error: errorMessage(error) };
  }
};

/**
 * Validate a build request and trigger the corresponding buildx job.
 * @param input - The raw request object; validated against {@link BuildRequest}.
 * @param deps - Optional injectable build runner, clock, and id generator.
 * @returns A GitHub-run-shaped record describing the completed build.
 */
export const triggerBuild = async (
  input: BuildRequestInput,
  deps: TriggerBuildDeps = {},
): Promise<BuildRun> => {
  const request = BuildRequest.parse(input);
  const build = deps.build ?? buildImage;
  const now = deps.now ?? defaultNow;

  const startedAt = now().toISOString();
  const outcome = await runBuildStep(build, request.inputs);
  const completedAt = now().toISOString();

  return BuildRun.parse({
    conclusion: outcome.conclusion,
    created_at: startedAt,
    event: request.event,
    head_ref: request.ref,
    head_sha: request.sha,
    id: (deps.runId ?? defaultRunId)(),
    run_started_at: startedAt,
    status: "completed",
    steps: [
      {
        completed_at: completedAt,
        conclusion: outcome.conclusion,
        error: outcome.error,
        name: "Build image",
        number: BUILD_STEP_NUMBER,
        started_at: startedAt,
        status: "completed",
      },
    ],
    tag: request.inputs.tag,
    updated_at: completedAt,
  });
};
