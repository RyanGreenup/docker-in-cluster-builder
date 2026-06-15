import "@rs/liatris-design/global.css";
import { RangerModal } from "@rs/solid-primitives";
import { createSignal, type JSX } from "solid-js";

import { liatrisRangerTheme } from "./liatris.css";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

// The same RangerModal primitive, reskinned through its `themeClass` prop with
// a theme built over the exported `rangerVars` contract using the
// @rs/liatris-design workspace package: IBM Plex type, the package's spacing and
// radius scales, and the semantic colour roles published by its global theme.
// Because those colours are CSS custom properties, the modal tracks the site's
// light/dark mode automatically. The behaviour and structure are identical to
// the Primitives/RangerModal story; only the token contract values differ.

const stageStyle: JSX.CSSProperties = {
  display: "grid",
  "place-items": "center",
  "min-height": "100vh",
  "font-family": "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif",
};

const openButtonStyle: JSX.CSSProperties = {
  padding: "0.625rem 1rem",
  border: "1px solid var(--border-default)",
  "border-radius": "var(--radius-md)",
  background: "var(--surface-raised)",
  color: "var(--fg-primary)",
  "font-size": "var(--text-sm)",
  cursor: "pointer",
};

const Demo = (): JSX.Element => {
  const [open, setOpen] = createSignal(true);
  return (
    <div style={stageStyle}>
      <button type="button" style={openButtonStyle} onClick={() => setOpen(true)}>
        Open browser (Cmd+O)
      </button>
      <RangerModal open={open} onClose={() => setOpen(false)} themeClass={liatrisRangerTheme} />
    </div>
  );
};

const meta = {
  title: "Exemplars/RangerModal",
  component: RangerModal,
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <Demo />,
};
