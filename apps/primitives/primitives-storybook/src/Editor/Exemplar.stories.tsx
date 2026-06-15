import { Editor } from "@rs/solid-primitives/exemplars";
import { createSignal } from "solid-js";

import type { EditorMode } from "@rs/solid-primitives";
import type { Meta, StoryObj } from "storybook-solidjs-vite";

const SAMPLE =
  "# Release notes\n\nA **WYSIWYG** editor with `inline code`, a list:\n\n- one\n- two\n\n> and a quote.\n";

interface EditorArgs {
  mode: EditorMode;
  vimMode: boolean;
}

const meta = {
  title: "Exemplars/Editor",
  component: Editor,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    mode: { control: "select", options: ["wysiwyg", "codemirror", "textarea"] },
    vimMode: { control: "boolean" },
  },
  args: { mode: "wysiwyg", vimMode: false },
} satisfies Meta<EditorArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args: EditorArgs) => {
    const [markdown, setMarkdown] = createSignal(SAMPLE);
    return (
      <div style={{ display: "grid", "grid-template-columns": "1fr 18rem", gap: "1rem" }}>
        <div style={{ height: "26rem" }}>
          <Editor
            value={markdown()}
            onChange={setMarkdown}
            mode={args.mode}
            vimMode={args.vimMode}
          />
        </div>
        <pre
          style={{
            margin: "0",
            padding: "0.75rem",
            background: "#f5f5f5",
            "white-space": "pre-wrap",
            "font-size": "12px",
            overflow: "auto",
          }}
        >
          {markdown()}
        </pre>
      </div>
    );
  },
};

const MATH_SAMPLE = [
  "# Math support",
  "",
  "Inline math like $E = mc^2$ and $\\frac{a}{b}$ flows with the text.",
  "",
  "$$",
  "\\int_0^1 x^2\\,dx = \\frac{1}{3}",
  "$$",
  "",
  "Click a formula to edit it in place: a popover shows the LaTeX with a live",
  "preview. Enter commits, Escape cancels, and clearing the field deletes the",
  "formula. Select some text and press a sigma toolbar button to convert it",
  "straight into math, or type dollar-delimited LaTeX as you write.",
  "",
].join("\n");

export const Math: Story = {
  render: (args: EditorArgs) => {
    const [markdown, setMarkdown] = createSignal(MATH_SAMPLE);
    return (
      <div style={{ display: "grid", "grid-template-columns": "1fr 18rem", gap: "1rem" }}>
        <div style={{ height: "26rem" }}>
          <Editor
            value={markdown()}
            onChange={setMarkdown}
            mode={args.mode}
            vimMode={args.vimMode}
          />
        </div>
        <pre
          style={{
            margin: "0",
            padding: "0.75rem",
            background: "#f5f5f5",
            "white-space": "pre-wrap",
            "font-size": "12px",
            overflow: "auto",
          }}
        >
          {markdown()}
        </pre>
      </div>
    );
  },
};

export const Wysiwyg: Story = { args: { mode: "wysiwyg" } };
export const CodeMirror: Story = { args: { mode: "codemirror" } };
export const PlainTextarea: Story = { args: { mode: "textarea" } };
