import { EditorShell } from "@rs/solid-primitives";
import type { EditorMode } from "@rs/solid-primitives";
import { createSignal } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs-vite";

const SAMPLE = "# Hello\n\nThis is **markdown** with a [link](https://example.com).\n";

const meta = {
  title: "Primitives/Editor",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Raw: Story = {
  render: () => {
    const [mode, setMode] = createSignal<EditorMode>("wysiwyg");
    const [markdown, setMarkdown] = createSignal(SAMPLE);
    return (
      <div style={{ display: "grid", gap: "0.75rem", "max-width": "44rem" }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {(["wysiwyg", "codemirror", "textarea"] as const).map((value) => (
            <button type="button" onClick={() => setMode(value)} disabled={mode() === value}>
              {value}
            </button>
          ))}
        </div>
        <div style={{ height: "20rem", border: "1px solid #ccc" }}>
          <EditorShell
            value={markdown()}
            onChange={setMarkdown}
            mode={mode()}
            onModeChange={setMode}
          />
        </div>
      </div>
    );
  },
};
