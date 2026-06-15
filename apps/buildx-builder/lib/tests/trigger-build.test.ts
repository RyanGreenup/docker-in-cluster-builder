import { afterEach, describe, expect, it, vi } from "vitest";

import { BuildStep } from "../src/api/contract/build-run.js";
import { triggerBuild } from "../src/api/trigger-build.js";

const buildImageMock = vi.fn();

vi.mock("../src/buildx/build.js", () => ({
  buildImage: (...buildArgs: unknown[]): unknown => buildImageMock(...buildArgs),
}));

const FIXED_NOW = new Date("2026-06-15T12:00:00.000Z");
const FIXED_ID = 4242;

const validRequest = {
  inputs: { contextDir: "/ctx", tag: "registry.example.com/app:abc123" },
  ref: "refs/heads/main",
  sha: "abc123",
};

afterEach(() => {
  buildImageMock.mockReset();
});

describe("triggerBuild", () => {
  it("validates the request and reports a successful run", async () => {
    buildImageMock.mockResolvedValue(undefined);

    const run = await triggerBuild(validRequest, {
      build: buildImageMock,
      now: () => FIXED_NOW,
      runId: () => FIXED_ID,
    });

    expect(run.id).toBe(FIXED_ID);
    expect(run.event).toBe("workflow_dispatch");
    expect(run.status).toBe("completed");
    expect(run.conclusion).toBe("success");
    expect(run.head_sha).toBe("abc123");
    expect(run.tag).toBe("registry.example.com/app:abc123");
    expect(run.steps).toHaveLength(1);
    expect(run.steps[0]?.conclusion).toBe("success");
    expect(run.steps[0]?.error).toBeUndefined();
    expect(buildImageMock).toHaveBeenCalledWith(
      expect.objectContaining({ contextDir: "/ctx", push: false }),
    );
  });

  it("reports a failed run when the build throws", async () => {
    const run = await triggerBuild(validRequest, {
      build: () => Promise.reject(new Error("boom")),
      now: () => FIXED_NOW,
      runId: () => FIXED_ID,
    });

    expect(run.conclusion).toBe("failure");
    expect(run.steps[0]?.conclusion).toBe("failure");
    expect(run.steps[0]?.error).toBe("boom");
  });

  it("surfaces a non-Error rejection as a string on the step", async () => {
    const run = await triggerBuild(validRequest, {
      build: () => Promise.reject("plain failure"),
      now: () => FIXED_NOW,
      runId: () => FIXED_ID,
    });

    expect(run.steps[0]?.error).toBe("plain failure");
  });

  it("falls back to the default build runner, clock and id", async () => {
    buildImageMock.mockResolvedValue(undefined);

    const run = await triggerBuild(validRequest);

    expect(run.conclusion).toBe("success");
    expect(Number.isInteger(run.id)).toBe(true);
    expect(buildImageMock).toHaveBeenCalledOnce();
  });

  it("rejects an invalid request", async () => {
    const invalid = { inputs: { contextDir: "", tag: "" } } as never;
    await expect(triggerBuild(invalid)).rejects.toThrow();
    expect(buildImageMock).not.toHaveBeenCalled();
  });
});

describe("BuildStep conclusion rule", () => {
  const base = {
    completed_at: null,
    name: "Build image",
    number: 1,
    started_at: null,
  };

  it("accepts a completed step with a conclusion", () => {
    expect(() =>
      BuildStep.parse({ ...base, conclusion: "success", status: "completed" }),
    ).not.toThrow();
  });

  it("rejects a completed step without a conclusion", () => {
    expect(() => BuildStep.parse({ ...base, conclusion: null, status: "completed" })).toThrow();
  });

  it("rejects an unfinished step that already has a conclusion", () => {
    expect(() =>
      BuildStep.parse({ ...base, conclusion: "success", status: "in_progress" }),
    ).toThrow();
  });
});
