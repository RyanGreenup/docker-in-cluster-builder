import "@rs/liatris-design/global.css";
import { SidebarShell } from "@rs/solid-primitives";
import { For, type JSX } from "solid-js";

import { fileList, fileRow, panel, stage } from "./liatris.css";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

// The same SidebarShell primitive skinned with @rs/liatris-design: an
// Explorer-first VS Code style sidebar, matching how the liatris Electron app
// Composes it (file tree section on top, further sections below). Colour
// Roles come from the design system's theme contract, so the panel tracks
// Light/dark mode automatically.

const FILES = ["notes/journal.md", "notes/ideas.md", "drafts/post.mdx", "readme.md"];

const Demo = (): JSX.Element => (
  <div class={stage}>
    <div class={panel}>
      <SidebarShell.Root aria-label="Sidebar">
        <SidebarShell.Section title={() => "Explorer"} defaultOpen>
          <ul class={fileList}>
            <For each={FILES}>{(file) => <li class={fileRow}>{file}</li>}</For>
          </ul>
        </SidebarShell.Section>
        <SidebarShell.Section title={() => "Outline"}>
          <ul class={fileList}>
            <li class={fileRow}>Introduction</li>
            <li class={fileRow}>Method</li>
            <li class={fileRow}>Results</li>
          </ul>
        </SidebarShell.Section>
        <SidebarShell.Section title={() => "Settings"}>
          <label style={{ display: "flex", gap: "0.5rem", "align-items": "center" }}>
            <input type="checkbox" checked /> Autosave
          </label>
        </SidebarShell.Section>
      </SidebarShell.Root>
    </div>
  </div>
);

const meta = {
  title: "Exemplars/SidebarShell",
  component: SidebarShell.Root,
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <Demo />,
};
