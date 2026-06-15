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

/**
 * Run the buildx job, mapping success or thrown errors to a CI conclusion.
 * @param build - The build runner to invoke.
 * @param inputs - Validated docker build inputs.
 * @returns "success" if the build resolved, otherwise "failure".
 */
const runBuildStep = async (
  build: (options: BuildOptions) => Promise<void>,
  inputs: BuildRequest["inputs"],
): Promise<Conclusion> => {
  try {
    await build({
      cacheRef: inputs.cacheRef,
      contextDir: inputs.contextDir,
      dockerfile: inputs.dockerfile,
      push: inputs.push,
      tag: inputs.tag,
      timeout: inputs.timeout,
    });
    return "success";
  } catch {
    return "failure";
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
  const conclusion = await runBuildStep(build, request.inputs);
  const completedAt = now().toISOString();

  return BuildRun.parse({
    conclusion,
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
        conclusion,
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
