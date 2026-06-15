import { DashboardShell } from "@rs/solid-primitives/exemplars";
import { For, type JSX } from "solid-js";
import { MINIMAL_VIEWPORTS } from "storybook/viewport";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

// The exemplar applies a riso-pop skin over the behavioural DashboardShell
// primitive: colour, borders, type and a marigold active marker, plus a brand,
// a fixed nav with lucide icons, and a mobile bottom tab bar. This is the
// branded reference look. A consuming design system layers its own theme over
// the raw primitive the same way -- see the Primitives/DashboardShell story for
// the unstyled structure.
//
// Resize below the 1024px breakpoint (use the Mobile story or the viewport
// toolbar) to watch the sidebar collapse into a drawer behind the hamburger and
// the bottom tab bar take over.

const SECTIONS = [
  {
    title: "Headless by construction",
    body: "The shell carries the grid, the responsive reflow and the drawer mechanics. Colour, type and the active accent all come from the exemplar skin, swappable per brand.",
  },
  {
    title: "One piece of shared state",
    body: "Only the drawer open/close state lives in the shell. The active destination is app state, expressed through the active prop on each nav row and bottom tab.",
  },
  {
    title: "Accessible active styling for free",
    body: "An active row sets aria-current=page alongside the active class, so assistive tech and the skin stay in lock step without extra wiring.",
  },
] as const;

const cardStyle: JSX.CSSProperties = {
  border: "2px solid #15101f",
  "border-radius": "0.75rem",
  padding: "1rem 1.125rem",
  background: "#ffffff",
};

const Content = (): JSX.Element => (
  <div style={{ display: "grid", gap: "1rem", "max-width": "44rem" }}>
    <h1 style={{ margin: "0" }}>Operations workspace</h1>
    <For each={SECTIONS}>
      {(section) => (
        <article style={cardStyle}>
          <h2 style={{ margin: "0 0 0.375rem", "font-size": "1.0625rem" }}>{section.title}</h2>
          <p style={{ margin: "0", "line-height": 1.5 }}>{section.body}</p>
        </article>
      )}
    </For>
  </div>
);

const meta = {
  title: "Exemplars/DashboardShell",
  component: DashboardShell,
  parameters: {
    layout: "fullscreen",
    viewport: { options: MINIMAL_VIEWPORTS },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

// Desktop: full sidebar grid column, navbar with the hamburger hidden.
export const Default: Story = {
  render: () => (
    <DashboardShell>
      <Content />
    </DashboardShell>
  ),
};

// Start on the "Recipients" destination to show the active accent on a row that
// is not the default.
export const RecipientsActive: Story = {
  render: () => (
    <DashboardShell defaultActive="recipients">
      <Content />
    </DashboardShell>
  ),
};

// Below the 1024px breakpoint the sidebar becomes a drawer behind the hamburger
// and the bottom tab bar appears. Tap the hamburger to open the drawer, then the
// dimmed scrim to close it.
export const MobileDrawer: Story = {
  render: () => (
    <DashboardShell>
      <Content />
    </DashboardShell>
  ),
  globals: { viewport: { value: "mobile2", isRotated: false } },
};
