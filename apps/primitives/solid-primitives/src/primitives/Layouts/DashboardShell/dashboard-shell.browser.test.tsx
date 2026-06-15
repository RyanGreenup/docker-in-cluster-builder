import { render } from "solid-js/web";
import { afterEach, expect, test } from "vitest";
import { page } from "vitest/browser";

import { DashboardShell } from "./index";
import * as styles from "./style.css";

const disposers: (() => void)[] = [];

afterEach(() => {
  for (const dispose of disposers) {
    dispose();
  }
  disposers.length = 0;
  document.body.innerHTML = "";
});

const part = (name: string): HTMLElement | null =>
  document.querySelector<HTMLElement>(`[data-part="dashboard-shell-${name}"]`);

const hasClass = (name: string, cls: string): boolean =>
  part(name)?.classList.contains(cls) ?? false;

const renderShell = (props: Record<string, unknown> = {}): void => {
  const dispose = render(
    () => (
      <DashboardShell.Root {...props}>
        <DashboardShell.Sidebar>
          <DashboardShell.NavItem active>Home</DashboardShell.NavItem>
          <DashboardShell.NavItem>Activity</DashboardShell.NavItem>
          <DashboardShell.DrawerToggle>Close</DashboardShell.DrawerToggle>
        </DashboardShell.Sidebar>
        <DashboardShell.Navbar>
          <DashboardShell.Hamburger>Menu</DashboardShell.Hamburger>
        </DashboardShell.Navbar>
        <DashboardShell.Main>content</DashboardShell.Main>
        <DashboardShell.Scrim />
        <DashboardShell.BottomBar>
          <DashboardShell.BottomTab active>Home</DashboardShell.BottomTab>
        </DashboardShell.BottomBar>
      </DashboardShell.Root>
    ),
    document.body,
  );
  disposers.push(dispose);
};

test("renders every part with its data-part hook", () => {
  renderShell();
  for (const name of [
    "root",
    "sidebar",
    "navbar",
    "hamburger",
    "drawer-toggle",
    "main",
    "scrim",
    "bottombar",
  ]) {
    expect(part(name)).not.toBeNull();
  }
});

test("drawer-toggle in the sidebar also toggles the drawer", () => {
  renderShell({ defaultOpen: true });
  const root = part("root");
  expect(root?.dataset.drawer).toBe("open");

  /*
   * The drawer-toggle sits inside the sidebar. Dispatch directly (the sidebar
   * is a fixed drawer that may be off-screen at the desktop test viewport) so
   * the handler fires regardless of CSS visibility.
   */
  part("drawer-toggle")?.click();
  expect(root?.dataset.drawer).toBe("closed");

  part("drawer-toggle")?.click();
  expect(root?.dataset.drawer).toBe("open");
});

test("starts closed and the hamburger opens the drawer state and classes", async () => {
  renderShell();
  const root = part("root");
  expect(root?.dataset.drawer).toBe("closed");
  expect(hasClass("sidebar", styles.sidebarOpen)).toBe(false);
  expect(hasClass("scrim", styles.scrimOpen)).toBe(false);

  await page.getByRole("button", { name: "Menu" }).click();

  expect(root?.dataset.drawer).toBe("open");
  expect(hasClass("sidebar", styles.sidebarOpen)).toBe(true);
  expect(hasClass("scrim", styles.scrimOpen)).toBe(true);
});

test("the hamburger toggles the drawer shut again", async () => {
  renderShell({ defaultOpen: true });
  const root = part("root");
  expect(root?.dataset.drawer).toBe("open");

  await page.getByRole("button", { name: "Menu" }).click();
  expect(root?.dataset.drawer).toBe("closed");
});

test("clicking the scrim closes the drawer", () => {
  renderShell({ defaultOpen: true });
  const root = part("root");
  expect(root?.dataset.drawer).toBe("open");

  /*
   * Dispatch the click directly: the scrim is mobile-only (display:none at the
   * desktop test viewport), but its close-on-click handler is what we assert.
   */
  part("scrim")?.click();
  expect(root?.dataset.drawer).toBe("closed");
});

test("controlled mode ignores internal toggles and reports requested changes", async () => {
  const changes: boolean[] = [];
  renderShell({ onOpenChange: (next: boolean) => changes.push(next), open: false });

  const root = part("root");
  await page.getByRole("button", { name: "Menu" }).click();

  // Stays closed because `open` is owned by the caller, but the request fired.
  expect(root?.dataset.drawer).toBe("closed");
  expect(changes).toEqual([true]);
});

test("active nav item and bottom tab expose aria-current", () => {
  renderShell();
  const activeNav = document.querySelector('[data-part="dashboard-shell-nav-item"][aria-current="page"]');
  const activeTab = document.querySelector('[data-part="dashboard-shell-bottom-tab"][aria-current="page"]');
  expect(activeNav?.textContent).toBe("Home");
  expect(activeTab?.textContent).toBe("Home");
});
