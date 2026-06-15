import "@rs/liatris-design/global.css";
import {
  CommandPalette,
  createFuseFileSearchProvider,
  type FileHit,
} from "@rs/solid-primitives";
import { createSignal, type JSX } from "solid-js";

import { openButton, palette, stage } from "./liatris.css";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

// The same CommandPalette primitive skinned with @rs/liatris-design through
// Its `class` prop and data-part hooks -- the exact look of the liatris
// Electron app's Mod+P file palette. Behaviour is identical to the
// Primitives/CommandPalette story; only the skin differs.

const FILES: FileHit[] = [
  { id: "/ws/notes/journal.md", name: "journal.md", path: "notes/journal.md" },
  { id: "/ws/notes/ideas.md", name: "ideas.md", path: "notes/ideas.md" },
  { id: "/ws/drafts/post.mdx", name: "post.mdx", path: "drafts/post.mdx" },
  { id: "/ws/drafts/talk.md", name: "talk.md", path: "drafts/talk.md" },
  { id: "/ws/readme.md", name: "readme.md", path: "readme.md" },
];

const Demo = (): JSX.Element => {
  const [open, setOpen] = createSignal(true);
  const [picked, setPicked] = createSignal<string | undefined>(undefined);
  const provider = createFuseFileSearchProvider(() => FILES);

  return (
    <div class={stage}>
      <button class={openButton} type="button" onClick={() => setOpen(true)}>
        Open palette {picked() === undefined ? "" : `(last: ${picked()})`}
      </button>
      <CommandPalette
        class={palette}
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
  title: "Exemplars/CommandPalette",
  component: CommandPalette,
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <Demo />,
};
