import { describe, expect, it } from "vitest";

import { mainCommand } from "../src/index.js";

describe("mainCommand", () => {
  it("documents a simple alpine build in its help text", () => {
    const meta = mainCommand.meta as { description?: string };
    expect(meta.description).toContain("alpine");
  });

  it("requires a context directory and an image tag", () => {
    const args = mainCommand.args as Record<string, { required?: boolean }>;
    expect(args.contextDir?.required).toBe(true);
    expect(args.tag?.required).toBe(true);
  });
});
