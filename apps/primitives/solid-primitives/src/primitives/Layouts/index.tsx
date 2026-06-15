/*
 * Headless layout primitives. Each layout describes the structure and behaviour
 * of a page chrome (grid, drawers, responsive reflow) with no skin; consumers or
 * exemplars apply the aesthetics. `DashboardShell` is the conventional sidebar +
 * navbar + mobile drawer dashboard layout.
 */

export { DashboardShell, useDashboardShell } from "./DashboardShell";
export type {
  DashboardShellBottomBarProps,
  DashboardShellButtonProps,
  DashboardShellContextValue,
  DashboardShellMainProps,
  DashboardShellNavbarProps,
  DashboardShellNavItemProps,
  DashboardShellRootProps,
  DashboardShellScrimProps,
  DashboardShellSidebarProps,
  DashboardShellSlotProps,
  DrawerStateProps,
} from "./DashboardShell";

export * as dashboardShellStyles from "./DashboardShell/style.css";
