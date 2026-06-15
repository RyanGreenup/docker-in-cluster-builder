import { EventEmitter } from "node:events";
import { afterEach, describe, expect, it, vi } from "vitest";

import { buildImage } from "../src/buildx/build.js";

const spawnMock = vi.fn();

vi.mock("node:child_process", () => ({
  spawn: (...spawnArgs: unknown[]): unknown => spawnMock(...spawnArgs),
}));

class FakeProc extends EventEmitter {
  public readonly stdout = new EventEmitter();
  public readonly stderr = new EventEmitter();
  public readonly kill = vi.fn();
}

afterEach(() => {
  spawnMock.mockReset();
  vi.useRealTimers();
});

describe("buildImage", () => {
  it("resolves when buildx exits successfully", async () => {
    const proc = new FakeProc();
    spawnMock.mockReturnValue(proc);

    const result = buildImage({ contextDir: "/ctx", tag: "img:1" });
    proc.emit("close", 0);

    await expect(result).resolves.toBeUndefined();
    expect(spawnMock).toHaveBeenCalledWith(
      "docker",
      ["buildx", "build", "--progress=plain", "--tag", "img:1", "--load", "/ctx"],
      { stdio: ["ignore", "pipe", "pipe"] },
    );
  });

  it("passes dockerfile, cache and push flags, and streams logs", async () => {
    const proc = new FakeProc();
    spawnMock.mockReturnValue(proc);
    const onLog = vi.fn();

    const result = buildImage({
      cacheRef: "reg/cache",
      contextDir: "/ctx",
      dockerfile: "Custom.Dockerfile",
      onLog,
      push: true,
      tag: "img:1",
    });
    proc.stdout.emit("data", Buffer.from("building"));
    proc.stderr.emit("data", Buffer.from("warn"));
    proc.emit("close", 0);

    await result;
    expect(onLog).toHaveBeenCalledWith("building");
    expect(onLog).toHaveBeenCalledWith("warn");
    const passedArgs = spawnMock.mock.calls[0]?.[1] as string[];
    expect(passedArgs).toEqual(
      expect.arrayContaining([
        "--file",
        "Custom.Dockerfile",
        "--cache-from",
        "type=registry,ref=reg/cache",
        "--cache-to",
        "type=registry,ref=reg/cache,mode=max",
        "--push",
      ]),
    );
    expect(passedArgs).not.toContain("--load");
  });

  it("rejects when buildx exits non-zero", async () => {
    const proc = new FakeProc();
    spawnMock.mockReturnValue(proc);

    const result = buildImage({ contextDir: "/ctx", tag: "img:1" });
    proc.emit("close", 1);

    await expect(result).rejects.toThrow("buildx exited with 1");
  });

  it("rejects when the process emits an error", async () => {
    const proc = new FakeProc();
    spawnMock.mockReturnValue(proc);

    const result = buildImage({ contextDir: "/ctx", tag: "img:1" });
    proc.emit("error", new Error("spawn failed"));

    await expect(result).rejects.toThrow("spawn failed");
  });

  it("kills the process and rejects when the build times out", async () => {
    vi.useFakeTimers();
    const proc = new FakeProc();
    spawnMock.mockReturnValue(proc);

    const result = buildImage({ contextDir: "/ctx", tag: "img:1", timeout: 1000 });
    const assertion = expect(result).rejects.toThrow("buildx timed out after 1000ms");
    await vi.advanceTimersByTimeAsync(1000);

    await assertion;
    expect(proc.kill).toHaveBeenCalledWith("SIGTERM");
  });
});
