import { Bell, House, List, Menu, Send, Users } from "lucide-solid";
import { For, createSignal, type JSXElement } from "solid-js";

import { DashboardShell as Shell } from "../../primitives/Layouts/DashboardShell";
import * as skin from "./style.css";

const NAV_ICON_SIZE = 18;
const TAB_ICON_SIZE = 20;

interface NavEntry {
  key: string;
  label: string;
  icon: () => JSXElement;
}

const NAV_ENTRIES: readonly NavEntry[] = [
  { icon: () => <Send size={NAV_ICON_SIZE} />, key: "send", label: "Send money" },
  { icon: () => <House size={NAV_ICON_SIZE} />, key: "home", label: "Home" },
  { icon: () => <Users size={NAV_ICON_SIZE} />, key: "recipients", label: "Recipients" },
  { icon: () => <List size={NAV_ICON_SIZE} />, key: "activity", label: "Activity" },
  { icon: () => <Bell size={NAV_ICON_SIZE} />, key: "alerts", label: "Rate alerts" },
];

const TAB_ENTRIES: readonly NavEntry[] = [
  { icon: () => <House size={TAB_ICON_SIZE} />, key: "home", label: "Home" },
  { icon: () => <Users size={TAB_ICON_SIZE} />, key: "recipients", label: "Recipients" },
  { icon: () => <Send size={TAB_ICON_SIZE} />, key: "send", label: "Send" },
  { icon: () => <List size={TAB_ICON_SIZE} />, key: "activity", label: "Activity" },
];

interface NavSelection {
  active: string;
  onSelect: (key: string) => void;
}

const SidebarNav = (props: NavSelection): JSXElement => (
  <>
    <div class={skin.navList}>
      <For each={NAV_ENTRIES}>
        {(entry) => (
          <Shell.NavItem
            class={skin.navItem}
            active={props.active === entry.key}
            onClick={() => props.onSelect(entry.key)}
          >
            {entry.icon()}
            <span>{entry.label}</span>
          </Shell.NavItem>
        )}
      </For>
    </div>
    <div class={skin.sidebarFooter}>
      <Shell.DrawerToggle class={skin.drawerToggle}>
        <List size={NAV_ICON_SIZE} />
        <span>Close menu</span>
      </Shell.DrawerToggle>
    </div>
  </>
);

const BottomTabs = (props: NavSelection): JSXElement => (
  <For each={TAB_ENTRIES}>
    {(entry) => (
      <Shell.BottomTab
        class={skin.bottomTab}
        active={props.active === entry.key}
        onClick={() => props.onSelect(entry.key)}
      >
        {entry.icon()}
        <span>{entry.label}</span>
      </Shell.BottomTab>
    )}
  </For>
);

export interface DashboardShellProps {
  /** Content rendered into the scrollable main region. */
  children?: JSXElement;
  /** Initial active nav key. */
  defaultActive?: string;
}

/**
 * Skinned reference build of the headless DashboardShell. Demonstrates how a
 * design system wires brand, nav rows, icons and a bottom tab bar into the
 * primitive's slots, and tracks the active destination locally.
 */
export const DashboardShell = (props: DashboardShellProps): JSXElement => {
  const [active, setActive] = createSignal(props.defaultActive ?? "home");

  return (
    <Shell.Root class={skin.root}>
      <Shell.Sidebar class={skin.sidebar} aria-label="Primary">
        <div class={skin.brand}>
          <Bell size={NAV_ICON_SIZE} aria-hidden="true" />
          <span>Acme</span>
        </div>
        <SidebarNav active={active()} onSelect={setActive} />
      </Shell.Sidebar>

      <Shell.Navbar class={skin.navbar}>
        <Shell.Hamburger class={skin.hamburger}>
          <Menu size={TAB_ICON_SIZE} />
        </Shell.Hamburger>
        <div class={skin.navActions}>
          <Bell size={TAB_ICON_SIZE} aria-hidden="true" />
        </div>
      </Shell.Navbar>

      <Shell.Main class={skin.main}>{props.children}</Shell.Main>

      <Shell.Scrim class={skin.scrim} />

      <Shell.BottomBar class={skin.bottomBar} aria-label="Primary mobile">
        <BottomTabs active={active()} onSelect={setActive} />
      </Shell.BottomBar>
    </Shell.Root>
  );
};
