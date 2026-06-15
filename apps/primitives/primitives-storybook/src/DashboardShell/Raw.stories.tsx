import { DashboardShell } from "@rs/solid-primitives";
import { createSignal, For, type JSX } from "solid-js";
import { MINIMAL_VIEWPORTS } from "storybook/viewport";

import type { Meta, StoryObj } from "storybook-solidjs-vite";

// The raw behavioural primitive with no theme applied. It ships only structure
// and drawer behaviour: the desktop sidebar + navbar + scrollable main grid,
// the sidebar collapsing into a sliding mobile drawer, the crossfading scrim,
// and the bottom tab bar. Every part stamps a `data-part` hook and carries
// structural classes only. The bare inline styling below exists purely so the
// structure is visible here; the branded look lives in Exemplars/DashboardShell.
//
// Resize the canvas below the 1024px breakpoint (use the Mobile story or the
// viewport toolbar) to watch the sidebar become a drawer and the bottom bar and
// hamburger appear.

const NAV = ["Overview", "Transfers", "Recipients", "Risk", "Reports"] as const;
const TABS = ["Home", "Transfers", "Send", "Activity"] as const;

const sidebarStyle: JSX.CSSProperties = {
  background: "#f8fafc",
  "border-right": "1px solid #cbd5e1",
  gap: "0.25rem",
  padding: "1rem 0.75rem",
};

const navbarStyle: JSX.CSSProperties = {
  background: "#ffffff",
  "border-bottom": "1px solid #cbd5e1",
  gap: "0.5rem",
  padding: "0 1rem",
};

const hamburgerStyle: JSX.CSSProperties = {
  border: "1px solid #cbd5e1",
  "border-radius": "0.375rem",
  background: "#ffffff",
  padding: "0.375rem 0.625rem",
};

const mainStyle: JSX.CSSProperties = {
  background: "#ffffff",
  color: "#0f172a",
  padding: "1.5rem",
};

const bottomBarStyle: JSX.CSSProperties = {
  background: "#ffffff",
  "border-top": "1px solid #cbd5e1",
};

const navItemStyle = (active: boolean): JSX.CSSProperties => ({
  gap: "0.5rem",
  padding: "0.5rem 0.625rem",
  "border-radius": "0.375rem",
  background: active ? "#e2e8f0" : "transparent",
  "font-weight": active ? 600 : 400,
});

const tabStyle = (active: boolean): JSX.CSSProperties => ({
  gap: "0.125rem",
  "font-size": "0.75rem",
  color: active ? "#0f172a" : "#64748b",
});

const RawShell = (props: { defaultOpen?: boolean }): JSX.Element => {
  const [active, setActive] = createSignal<string>("Overview");
  const [tab, setTab] = createSignal<string>("Home");

  return (
    <DashboardShell.Root defaultOpen={props.defaultOpen}>
      <DashboardShell.Sidebar style={sidebarStyle} aria-label="Primary">
        <strong style={{ padding: "0.25rem 0.625rem 0.75rem" }}>Acme</strong>
        <For each={NAV}>
          {(label) => (
            <DashboardShell.NavItem
              active={active() === label}
              onClick={() => setActive(label)}
              style={navItemStyle(active() === label)}
            >
              {label}
            </DashboardShell.NavItem>
          )}
        </For>
        <DashboardShell.DrawerToggle
          style={{
            ...hamburgerStyle,
            "margin-top": "auto",
            width: "100%",
            "justify-content": "center",
          }}
        >
          Close menu
        </DashboardShell.DrawerToggle>
      </DashboardShell.Sidebar>

      <DashboardShell.Navbar style={navbarStyle}>
        <DashboardShell.Hamburger style={hamburgerStyle}>Menu</DashboardShell.Hamburger>
        <strong>{active()}</strong>
      </DashboardShell.Navbar>

      <DashboardShell.Main style={mainStyle}>
        <h1 style={{ margin: "0 0 0.75rem" }}>{active()} workspace</h1>
        <p style={{ margin: "0 0 1rem", color: "#475569" }}>
          Everything you see is behaviour and structure. The grid reflows at the breakpoint, the
          hamburger toggles the drawer, the scrim and bottom bar fade in on mobile, and the active
          row carries <code>aria-current="page"</code>. Branding is layered by a skin -- see the
          Exemplars/DashboardShell story.
        </p>
        <p style={{ margin: "0", color: "#475569" }}>
          The sidebar nav and bottom tabs track their own active state through the
          <code> active</code> prop, which the consuming app owns. Only the drawer open/close state
          lives in the shell, exposed through <code>useDashboardShell()</code>.
        </p>
      </DashboardShell.Main>

      <DashboardShell.Scrim style={{ background: "rgba(15, 23, 42, 0.45)" }} />

      <DashboardShell.BottomBar style={bottomBarStyle} aria-label="Primary mobile">
        <For each={TABS}>
          {(label) => (
            <DashboardShell.BottomTab
              active={tab() === label}
              onClick={() => setTab(label)}
              style={tabStyle(tab() === label)}
            >
              {label}
            </DashboardShell.BottomTab>
          )}
        </For>
      </DashboardShell.BottomBar>
    </DashboardShell.Root>
  );
};

const meta = {
  title: "Primitives/DashboardShell",
  component: DashboardShell.Root,
  parameters: {
    layout: "fullscreen",
    viewport: { options: MINIMAL_VIEWPORTS },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

// Desktop: the sidebar is a static grid column, the hamburger / scrim / bottom
// bar are hidden by the structural media queries.
export const Default: Story = {
  render: () => <RawShell />,
};

// Below the 1024px breakpoint the sidebar becomes a sliding drawer. Click the
// hamburger to open it, then the scrim (the dimmed band) to close it again. The
// bottom tab bar replaces the sidebar nav.
export const MobileDrawer: Story = {
  render: () => <RawShell defaultOpen />,
  globals: { viewport: { value: "mobile2", isRotated: false } },
};
