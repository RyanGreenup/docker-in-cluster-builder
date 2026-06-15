import { SidebarShell } from "@rs/solid-primitives";
import { type JSX } from "solid-js";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

// The SidebarShell primitive unstyled: a VS Code style stack of independently
// Collapsible sections (each one an Accordion item). Behaviour only -- the
// Exemplars story layers a liatris-design skin over the same data-part hooks.

const stageStyle: JSX.CSSProperties = {
  display: "flex",
  "min-height": "100vh",
  background: "#e7ebee",
  "font-family": "ui-sans-serif, system-ui, sans-serif",
};

const panelStyle: JSX.CSSProperties = {
  width: "260px",
  background: "#ffffff",
  "border-right": "1px solid #c2ccd2",
};

const Demo = (): JSX.Element => (
  <div style={stageStyle}>
    <div style={panelStyle}>
      <SidebarShell.Root aria-label="Sidebar">
        <SidebarShell.Section title={() => "Explorer"} defaultOpen>
          <ul>
            <li>notes/journal.md</li>
            <li>notes/todo.md</li>
            <li>readme.md</li>
          </ul>
        </SidebarShell.Section>
        <SidebarShell.Section title={() => "Outline"}>
          <ul>
            <li>Introduction</li>
            <li>Method</li>
          </ul>
        </SidebarShell.Section>
        <SidebarShell.Section title={() => "Settings"}>
          <label>
            <input type="checkbox" checked /> Autosave
          </label>
        </SidebarShell.Section>
      </SidebarShell.Root>
    </div>
  </div>
);

const meta = {
  title: "Primitives/SidebarShell",
  component: SidebarShell.Root,
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <Demo />,
};
