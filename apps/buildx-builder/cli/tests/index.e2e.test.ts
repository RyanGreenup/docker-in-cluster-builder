import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { afterAll, describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);

// The build pulls alpine and runs buildx, so give it room.
const BUILD_TIMEOUT_MS = 300_000;
const TEST_TIMEOUT_MS = 360_000;

async function dockerAvailable(): Promise<boolean> {
  try {
    await execFileAsync("docker", ["buildx", "version"]);
    return true;
  } catch {
    return false;
  }
}

const hasDocker = await dockerAvailable();

describe.skipIf(!hasDocker)("cli builds and destroys an alpine image", () => {
  // Unique per test run so parallel/repeat runs do not clobber each other.
  const tag = `buildx-builder-cli-e2e:${process.pid}`;

  afterAll(async () => {
    await execFileAsync("docker", ["image", "rm", "--force", tag]).catch(() => undefined);
  });

  it(
    "builds a simple alpine image into the local daemon, then removes it",
    async () => {
      const contextDir = await mkdtemp(join(tmpdir(), "buildx-e2e-"));
      try {
        await writeFile(
          join(contextDir, "Dockerfile"),
          'FROM alpine:3.20\nCMD ["echo", "hello from alpine"]\n',
        );

        await execFileAsync("node", ["./dist/index.mjs", contextDir, "--tag", tag], {
          timeout: BUILD_TIMEOUT_MS,
        });

        const { stdout } = await execFileAsync("docker", ["image", "inspect", tag]);
        const inspected = JSON.parse(stdout) as Array<{ RepoTags?: string[] }>;
        expect(inspected[0]?.RepoTags).toContain(tag);

        await execFileAsync("docker", ["image", "rm", "--force", tag]);

        await expect(execFileAsync("docker", ["image", "inspect", tag])).rejects.toThrow();
      } finally {
        await rm(contextDir, { force: true, recursive: true });
      }
    },
    TEST_TIMEOUT_MS,
  );
});
