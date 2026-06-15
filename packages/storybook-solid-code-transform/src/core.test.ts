import { afterEach, describe, expect, it, vi } from "vitest";

import { createInlineStoryArgs } from "./core.js";
import { nodeToolkit } from "./node.js";

// Drive the platform-agnostic core through the real-`@babel/*` node toolkit (fast, no
// Browser). The browser toolkit is exercised end-to-end by test/browser-smoke.test.ts.
const inlineStoryArgs = createInlineStoryArgs(nodeToolkit);

// The story-object source text as Storybook's csf pipeline regenerates it: a bare
// `render: (args) => <JSX/>` as the final property of the object literal.
const AUTOGRID = `{
  args: { min: "md", gap: "normal" },
  render: (args): JSXElement => <AutoGrid min={args.min} gap={args.gap}>
      {CELLS.map(n => <Tile>Cell {n}</Tile>)}
    </AutoGrid>
}`;

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createInlineStoryArgs", () => {
  it("inlines a string arg as a plain JSX attribute and returns only the render body", () => {
    const out = inlineStoryArgs(AUTOGRID, { gap: "normal", min: "md" });

    expect(out).toContain(`<AutoGrid min="md" gap="normal">`);
    expect(out).not.toContain("args.min");
    expect(out).not.toContain("render:");
  });

  it("inlines whatever args it is given (different args produce different output)", () => {
    const out = inlineStoryArgs(AUTOGRID, { gap: "loose", min: "xl" });

    expect(out).toContain(`<AutoGrid min="xl" gap="loose">`);
  });

  it("keeps numeric and boolean args as JSX expressions, not strings", () => {
    const source = `{
      args: { count: 3, open: true },
      render: (args): JSXElement => <Widget count={args.count} open={args.open} />
    }`;

    const out = inlineStoryArgs(source, { count: 3, open: true });

    expect(out).toContain("count={3}");
    expect(out).toContain("open={true}");
  });

  it("leaves function and undefined args untouched", () => {
    const source = `{
      args: { onPick: undefined },
      render: (args): JSXElement => <Table onPick={args.onPick} />
    }`;

    const out = inlineStoryArgs(source, { onPick: () => {} });

    expect(out).toContain("onPick={args.onPick}");
  });

  it("handles a parenthesised, multi-line render body (shape a regex cannot)", () => {
    const source = `{
      args: { min: "sm" },
      render: (args): JSXElement => (
        <AutoGrid min={args.min}>
          <Tile>only</Tile>
        </AutoGrid>
      ),
    }`;

    const out = inlineStoryArgs(source, { min: "sm" });

    expect(out).toContain(`<AutoGrid min="sm">`);
    expect(out).not.toContain("render:");
  });

  it("handles render not being the last property", () => {
    const source = `{
      render: (args): JSXElement => <AutoGrid min={args.min} />,
      args: { min: "lg" },
    }`;

    const out = inlineStoryArgs(source, { min: "lg" });

    expect(out).toContain(`<AutoGrid min="lg"`);
    expect(out).not.toContain("args:");
  });

  it("returns the source unchanged when there is no render (e.g. args-only stories)", () => {
    const source = `{ args: { min: "md" } }`;

    expect(inlineStoryArgs(source, { min: "md" })).toBe(source);
  });

  it("self-heals on unparseable source: logs and returns the raw string", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const garbage = "{ render: (args) => <<< not valid (((";

    const out = inlineStoryArgs(garbage, { min: "md" });

    expect(out).toBe(garbage);
    expect(errorSpy).toHaveBeenCalledOnce();
  });
});
