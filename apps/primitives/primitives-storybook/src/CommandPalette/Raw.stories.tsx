import {
  CommandPalette,
  createFuseFileSearchProvider,
  type FileHit,
} from "@rs/solid-primitives";
import { createSignal, type JSX } from "solid-js";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

// The CommandPalette primitive unstyled: a modal fuzzy-find input over a
// Ranked list (the Cmd/Ctrl+P pattern). The palette depends only on the
// FileSearchProvider interface; this story feeds it the shipped Fuse provider
// Over an in-memory file list. ArrowUp/Down move, Enter opens, Escape closes.

const FILES: FileHit[] = [
  { id: "/ws/notes/journal.md", name: "journal.md", path: "notes/journal.md" },
  { id: "/ws/notes/ideas.md", name: "ideas.md", path: "notes/ideas.md" },
  { id: "/ws/drafts/post.mdx", name: "post.mdx", path: "drafts/post.mdx" },
  { id: "/ws/drafts/talk.md", name: "talk.md", path: "drafts/talk.md" },
  { id: "/ws/readme.md", name: "readme.md", path: "readme.md" },
];

const stageStyle: JSX.CSSProperties = {
  display: "grid",
  "place-items": "center",
  "min-height": "100vh",
  background: "#e7ebee",
  "font-family": "ui-sans-serif, system-ui, sans-serif",
};

const Demo = (): JSX.Element => {
  const [open, setOpen] = createSignal(true);
  const [picked, setPicked] = createSignal<string | undefined>(undefined);
  const provider = createFuseFileSearchProvider(() => FILES);

  return (
    <div style={stageStyle}>
      <button type="button" onClick={() => setOpen(true)}>
        Open palette {picked() === undefined ? "" : `(last: ${picked()})`}
      </button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        onSelect={(hit) => {
          setPicked(hit.path);
          setOpen(false);
        }}
        provider={provider}
      />
    </div>
  );
};

const meta = {
  title: "Primitives/CommandPalette",
  component: CommandPalette,
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <Demo />,
};
