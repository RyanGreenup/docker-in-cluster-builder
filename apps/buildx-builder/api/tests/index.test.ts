import { helloWorld } from "@rs/buildx-builder-api";
import { describe, it, expect } from "vitest";

describe("@rs/buildx-builder-server exports", () => {
  it("exports HelloWorld", () => {
    expect(helloWorld()).toBe("Hello, World!");
  });
});
