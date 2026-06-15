import { style } from "@vanilla-extract/css";

import { tokens, vars } from "../../styles/theme.css";

/*
 * A riso-pop demo skin for the headless DashboardShell. Adds the colour, border,
 * shadow and type that the structural primitive deliberately omits, proving the
 * shell accepts an arbitrary theme. Swap for the consuming design system.
 */

const { pop, surface } = vars.color;

/** Applied to DashboardShell.Root - paints the page surface and type. */
export const root = style({
  background: pop.paper,
  color: pop.ink,
  fontFamily: tokens.font.outfit,
});

export const sidebar = style({
  background: surface["50"],
  borderRight: `2px solid ${pop.ink}`,
  gap: "0.5rem",
  padding: "1rem",
});

export const navbar = style({
  background: surface["50"],
  borderBottom: `2px solid ${pop.ink}`,
  gap: "0.75rem",
  padding: "0 1.25rem",
});

export const brand = style({
  display: "flex",
  alignItems: "center",
  gap: "0.625rem",
  padding: "0.5rem",
  marginBottom: "0.75rem",
  fontWeight: Number(tokens.fontWeight.bold),
  fontSize: tokens.text.lg,
});

export const hamburger = style({
  width: "2.625rem",
  height: "2.625rem",
  border: `2px solid ${pop.ink}`,
  borderRadius: tokens.radius.card,
  background: surface["50"],
  color: pop.ink,
});

export const navActions = style({
  marginLeft: "auto",
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
});

export const main = style({
  padding: "1.5rem",
});

export const scrim = style({
  background: "rgba(21, 16, 31, 0.4)",
});

export const bottomBar = style({
  background: surface["50"],
  borderTop: `2px solid ${pop.ink}`,
  padding: "0.5rem",
});

export const sidebarFooter = style({
  marginTop: "auto",
  paddingTop: "0.75rem",
  borderTop: `1px solid ${pop.ink}`,
});

export const drawerToggle = style({
  gap: "0.5rem",
  padding: "0.5rem 0.75rem",
  borderRadius: tokens.radius.card,
  color: pop.ink,
  border: `2px solid ${pop.ink}`,
  fontWeight: Number(tokens.fontWeight.semibold),
  background: surface["100"],
  width: "100%",
  selectors: {
    "&:hover": { background: surface["200"] },
  },
});

export const navList = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
});

export const navItem = style({
  gap: "0.75rem",
  padding: "0.5rem 0.75rem",
  borderRadius: tokens.radius.card,
  color: pop.ink,
  border: "2px solid transparent",
  fontWeight: Number(tokens.fontWeight.semibold),
  selectors: {
    '&:not([aria-current="page"]):hover': {
      background: surface["200"],
    },
  },
});

export const navItemActive = style({
  background: pop.marigold,
  borderColor: pop.ink,
});

export const bottomTab = style({
  gap: "0.25rem",
  fontSize: tokens.text.xs,
  fontWeight: Number(tokens.fontWeight.semibold),
  color: surface["600"],
});

export const bottomTabActive = style({
  color: pop.pink,
});
