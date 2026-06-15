import { spawn } from "node:child_process";

const DEFAULT_TIMEOUT_MS = 300_000;
const EXIT_SUCCESS = 0;

export interface BuildOptions {
  /** Path to the build context. */
  contextDir: string;
  /** E.g. "registry.example.com/app:abc123". */
  tag: string;
  /** Defaults to <contextDir>/Dockerfile. */
  dockerfile?: string;
  /** Push to registry, else load into local daemon. */
  push?: boolean;
  /** Optional registry ref for --cache-to/--cache-from. */
  cacheRef?: string;
  /** Milliseconds before the build is killed. Default: 5 minutes. */
  timeout?: number;
  /**
   * Callback to get back the log from the build. Note, the `STDOUT` and `STDERR`
   * are the same with buildX so we don't bother splitting.
   */
  onLog?: (chunk: string) => void;
}

/**
 * Build a docker image with buildx, streaming logs and enforcing a timeout.
 * @param opts - Build configuration: context, tag, and optional behaviour.
 */
export const buildImage = (opts: BuildOptions): Promise<void> => {
  const { timeout = DEFAULT_TIMEOUT_MS } = opts;
  const args = ["buildx", "build", "--progress=plain", "--tag", opts.tag];

  if (opts.dockerfile) {
    args.push("--file", opts.dockerfile);
  }
  if (opts.cacheRef) {
    args.push("--cache-from", `type=registry,ref=${opts.cacheRef}`);
    args.push("--cache-to", `type=registry,ref=${opts.cacheRef},mode=max`);
  }
  let loadOrPush = "--load";
  if (opts.push) {
    loadOrPush = "--push";
  }
  args.push(loadOrPush, opts.contextDir);

  return new Promise((resolve, reject) => {
    const proc = spawn("docker", args, { stdio: ["ignore", "pipe", "pipe"] });

    const timer = setTimeout(() => {
      proc.kill("SIGTERM");
      reject(new Error(`buildx timed out after ${timeout}ms`));
    }, timeout);

    const handle = (chunk: Buffer) => opts.onLog?.(chunk.toString());
    proc.stdout.on("data", handle);
    proc.stderr.on("data", handle);

    proc.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
    proc.on("close", (code) => {
      clearTimeout(timer);
      if (code === EXIT_SUCCESS) {
        resolve();
      } else {
        reject(new Error(`buildx exited with ${code}`));
      }
    });
  });
};
