import { RangerModal } from "@rs/solid-primitives";
import { createSignal, type JSX } from "solid-js";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

// The RangerModal primitive in its built-in "primitive design": a ranger-style
// vault browser with Miller columns (parent / current / preview), a filter bar,
// multi-select with a bulk action bar, and inline create/rename/delete. Every
// colour, font, radius and space resolves from the `rangerVars` vanilla-extract
// theme contract; this story applies no theme, so the modal renders with its
// default `rangerTheme` skin (a cool-slate light surface with an indigo accent).
//
// It is keyboard-driven: j/k move, h/l change level, space marks, n creates,
// r renames, d deletes, "/" focuses the filter, and Enter opens. The Exemplars
// story reskins this exact primitive through the `themeClass` prop.

const stageStyle: JSX.CSSProperties = {
  display: "grid",
  "place-items": "center",
  "min-height": "100vh",
  background: "#e7ebee",
  "font-family": "ui-sans-serif, system-ui, sans-serif",
};

const openButtonStyle: JSX.CSSProperties = {
  padding: "0.625rem 1rem",
  border: "1px solid #c2ccd2",
  "border-radius": "0.5rem",
  background: "#ffffff",
  color: "#141b20",
  "font-size": "0.875rem",
  cursor: "pointer",
};

const Demo = (): JSX.Element => {
  const [open, setOpen] = createSignal(true);
  return (
    <div style={stageStyle}>
      <button type="button" style={openButtonStyle} onClick={() => setOpen(true)}>
        Open browser (Cmd+O)
      </button>
      <RangerModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

const meta = {
  title: "Primitives/RangerModal",
  component: RangerModal,
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <Demo />,
};
