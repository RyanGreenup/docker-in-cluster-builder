import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);

describe("cli", () => {
  it("prints the placeholder message from the library", async () => {
    const { stdout } = await execFileAsync("node", ["./dist/index.mjs", "World"]);

    expect(stdout.trim()).toBe("Hello, World!");
  });
});
