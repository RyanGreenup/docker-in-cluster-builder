// Import the BUILT browser artifact (what Storybook actually consumes), so this
// exercises the shipped @babel/standalone-backed dist in a real browser where the
// Node `process` global is undefined.
import { inlineStoryArgs } from "../../dist/browser.js";

declare global {
  interface Window {
    __smoke?: { ok: boolean; output: string; error: string };
  }
}

const AUTOGRID = `{
  args: { min: "md", gap: "normal" },
  render: (args): JSXElement => <AutoGrid min={args.min} gap={args.gap}>
      {CELLS.map(n => <Tile>Cell {n}</Tile>)}
    </AutoGrid>
}`;

try {
  const output = inlineStoryArgs(AUTOGRID, { min: "md", gap: "normal" });
  window.__smoke = { ok: true, output, error: "" };
} catch (error) {
  window.__smoke = { ok: false, output: "", error: String(error) };
}
