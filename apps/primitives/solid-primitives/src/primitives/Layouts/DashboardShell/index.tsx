import { type JSX, splitProps } from "solid-js";

import { DashboardShellProvider, useDashboardShell, type DrawerStateProps } from "./context";
import * as styles from "./style.css";

/*
 * Headless dashboard shell: the conventional sidebar + top navbar + scrollable
 * main, where the sidebar collapses into a sliding mobile drawer backed by a
 * crossfading scrim and a bottom tab bar. Behaviour and structure only - every
 * part stamps a stable `data-part` hook (matching the Dialog / Accordion
 * convention) and carries structural classes only, so skins style predictable
 * targets. Consumers supply brand, nav rows, icons and copy as children.
 */

/*
 * Accepts `unknown` because polymorphic prop types surface `class` as `any`; we
 * narrow to non-empty strings so callers never leak `any` into the merge.
 */
export const joinClass = (...classes: unknown[]): string =>
  classes.filter((value): value is string => typeof value === "string" && value !== "").join(" ");

const drawerAttr = (open: boolean): "open" | "closed" => (open ? "open" : "closed");

export interface DashboardShellRootProps extends DrawerStateProps {
  class?: string;
  children: JSX.Element;
}

export type DashboardShellSlotProps = JSX.HTMLAttributes<HTMLElement>;
export type DashboardShellMainProps = JSX.HTMLAttributes<HTMLElement>;
export type DashboardShellNavbarProps = JSX.HTMLAttributes<HTMLElement>;
export type DashboardShellSidebarProps = JSX.HTMLAttributes<HTMLElement>;
export type DashboardShellBottomBarProps = JSX.HTMLAttributes<HTMLElement>;
export type DashboardShellScrimProps = JSX.HTMLAttributes<HTMLDivElement>;

export interface DashboardShellButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  class?: string;
}

export interface DashboardShellNavItemProps extends DashboardShellButtonProps {
  /** Marks this row as the current destination (sets `aria-current` + active class). */
  active?: boolean;
}

const ariaCurrent = (active: boolean | undefined): "page" | undefined =>
  active === true ? "page" : undefined;

/**
 * Root grid. Owns the drawer state (controlled via `open`/`onOpenChange`, or
 * uncontrolled via `defaultOpen`) and reflects it on `data-drawer` as a styling
 * and E2E hook.
 */
const Root = (props: DashboardShellRootProps): JSX.Element => {
  const [local, drawerProps] = splitProps(props, ["class", "children"]);
  return (
    <DashboardShellProvider
      open={drawerProps.open}
      defaultOpen={drawerProps.defaultOpen}
      onOpenChange={drawerProps.onOpenChange}
    >
      <RootSurface class={local.class}>{local.children}</RootSurface>
    </DashboardShellProvider>
  );
};

// Inner surface so it can read the context the provider above just set.
const RootSurface = (props: { class?: string; children: JSX.Element }): JSX.Element => {
  const shell = useDashboardShell();
  return (
    <div
      class={joinClass(styles.root, props.class)}
      data-part="dashboard-shell-root"
      data-drawer={drawerAttr(shell.drawerOpen())}
    >
      {props.children}
    </div>
  );
};

/** Sidebar body - also the mobile drawer (CSS repositions the same element). */
const Sidebar = (props: DashboardShellSidebarProps): JSX.Element => {
  const shell = useDashboardShell();
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <aside
      {...rest}
      class={joinClass(styles.sidebar, local.class)}
      classList={{ [styles.sidebarOpen]: shell.drawerOpen() }}
      data-part="dashboard-shell-sidebar"
    />
  );
};

/** Top navbar. */
const Navbar = (props: DashboardShellNavbarProps): JSX.Element => {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <header {...rest} class={joinClass(styles.navbar, local.class)} data-part="dashboard-shell-navbar" />
  );
};

/** Hamburger - toggles the drawer. Mobile-only via CSS. */
const Hamburger = (props: DashboardShellButtonProps): JSX.Element => {
  const shell = useDashboardShell();
  const [local, rest] = splitProps(props, ["class", "onClick"]);
  return (
    <button
      type="button"
      aria-label="Toggle menu"
      {...rest}
      class={joinClass(styles.hamburger, local.class)}
      data-part="dashboard-shell-hamburger"
      aria-expanded={shell.drawerOpen()}
      onClick={(event) => {
        shell.toggle();
        if (typeof local.onClick === "function") {
          local.onClick(event);
        }
      }}
    />
  );
};

/** Main scroll region - the only scrollable area. */
const Main = (props: DashboardShellMainProps): JSX.Element => {
  const [local, rest] = splitProps(props, ["class"]);
  return <main {...rest} class={joinClass(styles.main, local.class)} data-part="dashboard-shell-main" />;
};

/**
 * Mobile scrim. Always mounted so it crossfades with the drawer; clicking it
 * closes the drawer.
 */
const Scrim = (props: DashboardShellScrimProps): JSX.Element => {
  const shell = useDashboardShell();
  const [local, rest] = splitProps(props, ["class", "onClick"]);
  return (
    <div
      role="presentation"
      aria-hidden="true"
      {...rest}
      class={joinClass(styles.scrim, local.class)}
      classList={{ [styles.scrimOpen]: shell.drawerOpen() }}
      data-part="dashboard-shell-scrim"
      onClick={(event) => {
        shell.close();
        if (typeof local.onClick === "function") {
          local.onClick(event);
        }
      }}
    />
  );
};

/** Mobile bottom tab bar. */
const BottomBar = (props: DashboardShellBottomBarProps): JSX.Element => {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <nav {...rest} class={joinClass(styles.bottomBar, local.class)} data-part="dashboard-shell-bottombar" />
  );
};

/**
 * Generic sidebar nav row. `active` wires `aria-current="page"` and the active
 * class so consumers get accessible active styling for free; they may still
 * bring their own element instead.
 */
const NavItem = (props: DashboardShellNavItemProps): JSX.Element => {
  const [local, rest] = splitProps(props, ["class", "active"]);
  return (
    <button
      type="button"
      {...rest}
      class={joinClass(styles.navItem, local.class)}
      classList={{ [styles.navItemActive]: local.active }}
      data-part="dashboard-shell-nav-item"
      aria-current={ariaCurrent(local.active)}
    />
  );
};

/**
 * In-drawer close/toggle button. Placed at the bottom of the sidebar so a
 * thumb can dismiss the drawer without stretching to the navbar hamburger.
 * Hidden on desktop (CSS) because there is no drawer there.
 */
const DrawerToggle = (props: DashboardShellButtonProps): JSX.Element => {
  const shell = useDashboardShell();
  const [local, rest] = splitProps(props, ["class", "onClick"]);
  return (
    <button
      type="button"
      aria-label="Close navigation"
      {...rest}
      class={joinClass(styles.drawerToggle, local.class)}
      data-part="dashboard-shell-drawer-toggle"
      aria-expanded={shell.drawerOpen()}
      onClick={(event) => {
        shell.toggle();
        if (typeof local.onClick === "function") {
          local.onClick(event);
        }
      }}
    />
  );
};

/** Generic bottom-bar tab. Same active wiring as `NavItem`. */
const BottomTab = (props: DashboardShellNavItemProps): JSX.Element => {
  const [local, rest] = splitProps(props, ["class", "active"]);
  return (
    <button
      type="button"
      {...rest}
      class={joinClass(styles.bottomTab, local.class)}
      classList={{ [styles.bottomTabActive]: local.active }}
      data-part="dashboard-shell-bottom-tab"
      aria-current={ariaCurrent(local.active)}
    />
  );
};

/** Headless dashboard shell. Compose `DashboardShell.Root` with the named parts. */
export const DashboardShell = {
  BottomBar,
  BottomTab,
  DrawerToggle,
  Hamburger,
  Main,
  NavItem,
  Navbar,
  Root,
  Scrim,
  Sidebar,
} as const;

export { useDashboardShell } from "./context";
export type { DashboardShellContextValue, DrawerStateProps } from "./context";
