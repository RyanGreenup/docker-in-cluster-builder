import { describe, expect, it } from "vitest";

import { messageFromArgs } from "../src/index.js";

describe("messageFromArgs", () => {
  it("uses the provided name", () => {
    expect(messageFromArgs(["World"])).toBe("Hello, World!");
  });

  it("uses a default name", () => {
    expect(messageFromArgs([])).toBe("Hello, World!");
  });
});
