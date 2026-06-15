import { expect, it } from "vitest";

import { inlineStoryArgs } from "./node.js";

// Smoke: the node entry resolves and runs the transform through the real `@babel/*`
// Packages. (The browser entry is covered by test/browser-smoke.test.ts.)
it("node variant inlines args via the real @babel/* toolkit", () => {
  const source = `{
    args: { min: "md", gap: "normal" },
    render: (args): JSXElement => <AutoGrid min={args.min} gap={args.gap} />
  }`;

  const out = inlineStoryArgs(source, { gap: "normal", min: "md" });

  expect(out).toContain(`<AutoGrid min="md" gap="normal"`);
  expect(out).not.toContain("args.min");
});
