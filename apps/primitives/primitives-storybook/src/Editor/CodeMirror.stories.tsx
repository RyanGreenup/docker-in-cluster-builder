import {
  CodeMirrorEditor,
  EditorContentProvider,
  EditorSettingsProvider,
  type EditorMode,
} from "@rs/solid-primitives";
import { createSignal } from "solid-js";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

const SAMPLE_MARKDOWN = `# CodeMirror Editor

Press Shift-Tab anywhere to cycle the whole document: overview, contents, show all.
Put the cursor on a heading line and press Tab to cycle that subtree like org-mode:
folded, then direct children, then everything.

## Folding

Tab on this parent heading shows its direct children first; the grandchild stays
hidden until you Tab into a child.

### Nested heading

Deeper content lives here.

#### Grandchild heading

Hidden in the children view of "Folding".

## Leaf heading

This section has only text, so Tab simply toggles it folded and back.

## Structure Editing

With org keybindings on, the cursor on a heading line gives you:
Alt-Left / Alt-Right promote or demote the heading,
Alt-Shift-Left / Alt-Shift-Right promote or demote the whole subtree,
Alt-Up / Alt-Down swap the subtree with its sibling.
Anywhere in a section, Alt-Enter inserts a sibling heading after the current
line and Ctrl-Enter (Cmd-Enter on mac) inserts one after the whole subtree.

## Vim Mode

Toggle vim mode via the story control. On touch devices vim auto-disables.
Tab in body text falls through to vim or the default handler.

\`\`\`js
function example() {
  return "brace folding works here too";
}
\`\`\`
`;

interface EditorArgs {
  lineNumbers: boolean;
  orgKeybindings: boolean;
  vimMode: boolean;
}

const meta = {
  args: { lineNumbers: true, orgKeybindings: true, vimMode: false },
  argTypes: {
    lineNumbers: { control: "boolean" },
    orgKeybindings: { control: "boolean" },
    vimMode: { control: "boolean" },
  },
  parameters: { layout: "fullscreen" },
  render: (args) => {
    const [content, setContent] = createSignal(SAMPLE_MARKDOWN);
    const [editorMode, setEditorMode] = createSignal<EditorMode>("codemirror");
    const [vimEnabled, setVimEnabled] = createSignal(args.vimMode);

    return (
      <div style={{ border: "1px dashed #cbd5e1", height: "600px" }}>
        <EditorContentProvider content={content} setContent={setContent}>
          <EditorSettingsProvider
            editorMode={editorMode}
            lineNumbers={() => args.lineNumbers}
            orgKeybindings={() => args.orgKeybindings}
            setEditorMode={setEditorMode}
            setVimMode={setVimEnabled}
            vimMode={vimEnabled}
          >
            <CodeMirrorEditor />
          </EditorSettingsProvider>
        </EditorContentProvider>
      </div>
    );
  },
  tags: ["autodocs"],
  title: "Primitives/Editor/CodeMirror",
} satisfies Meta<EditorArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const VimEnabled: Story = {
  args: { vimMode: true },
};

export const OrgKeybindings: Story = {
  args: { orgKeybindings: true },
};

export const OrgKeybindingsOff: Story = {
  args: { orgKeybindings: false },
};
