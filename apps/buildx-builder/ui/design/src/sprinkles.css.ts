import { createSprinkles, defineProperties } from "@vanilla-extract/sprinkles";

import * as tokens from "./tokens";

// ── Responsive layout — matches the app's three breakpoints ───────────────────
const responsiveProperties = defineProperties({
  conditions: {
    default: {},
    tablet: { "@media": "screen and (max-width: 1039px)" },
    mobile: { "@media": "screen and (max-width: 720px)" },
  },
  defaultCondition: "default",
  properties: {
    display: ["flex", "inline-flex", "grid", "inline-grid", "block", "inline", "contents", "none"],
    position: ["relative", "absolute", "fixed", "sticky"],
    flexDirection: ["row", "column", "row-reverse", "column-reverse"],
    flexWrap: ["wrap", "nowrap"],
    alignItems: ["center", "flex-start", "flex-end", "stretch", "baseline"],
    justifyContent: [
      "center",
      "flex-start",
      "flex-end",
      "space-between",
      "space-around",
      "space-evenly",
    ],
    alignSelf: ["auto", "center", "flex-start", "flex-end", "stretch"],
    flex: { "1": "1 1 0%", auto: "auto", none: "none", initial: "initial" },
    flexGrow: { "0": "0", "1": "1" },
    flexShrink: { "0": "0", "1": "1" },
    gap: tokens.space,
    rowGap: tokens.space,
    columnGap: tokens.space,
    padding: tokens.space,
    paddingTop: tokens.space,
    paddingBottom: tokens.space,
    paddingLeft: tokens.space,
    paddingRight: tokens.space,
    margin: tokens.space,
    marginTop: tokens.space,
    marginBottom: tokens.space,
    marginLeft: tokens.space,
    marginRight: tokens.space,
    overflow: ["hidden", "auto", "scroll", "visible", "clip"],
    overflowX: ["hidden", "auto", "scroll", "visible"],
    overflowY: ["hidden", "auto", "scroll", "visible"],
    width: {
      "0": "0",
      full: "100%",
      screen: "100vw",
      auto: "auto",
      "fit-content": "fit-content",
      "max-content": "max-content",
      "min-content": "min-content",
    },
    height: {
      "0": "0",
      full: "100%",
      screen: "100vh",
      dvh: "100dvh",
      auto: "auto",
    },
    minWidth: { "0": "0", auto: "auto", full: "100%" },
    minHeight: { "0": "0", auto: "auto", full: "100%" },
    maxWidth: {
      none: "none",
      full: "100%",
      page: "77.5rem",
    },
  },
  shorthands: {
    paddingX: ["paddingLeft", "paddingRight"],
    paddingY: ["paddingTop", "paddingBottom"],
    marginX: ["marginLeft", "marginRight"],
    marginY: ["marginTop", "marginBottom"],
    inset: ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"],
    placeItems: ["alignItems", "justifyContent"],
  },
});

// ── Color — semantic tokens; resolve at runtime for dark mode ─────────────────
const colorProperties = defineProperties({
  conditions: {
    default: {},
    hover: { selector: "&:hover" },
    focus: { selector: "&:focus-visible" },
    active: { selector: "&:active" },
    disabled: { selector: '&:disabled, &[aria-disabled="true"]' },
  },
  defaultCondition: "default",
  properties: {
    backgroundColor: {
      "surface-base": "var(--surface-base)",
      "surface-raised": "var(--surface-raised)",
      "surface-sunken": "var(--surface-sunken)",
      "surface-overlay": "var(--surface-overlay)",
      "surface-hover": "var(--surface-hover)",
      accent: "var(--accent)",
      "accent-soft": "var(--accent-soft)",
      transparent: "transparent",
    },
    color: {
      "fg-primary": "var(--fg-primary)",
      "fg-secondary": "var(--fg-secondary)",
      "fg-tertiary": "var(--fg-tertiary)",
      "fg-muted": "var(--fg-muted)",
      "fg-on-accent": "var(--fg-on-accent)",
      accent: "var(--accent)",
      inherit: "inherit",
    },
    borderColor: {
      subtle: "var(--border-subtle)",
      default: "var(--border-default)",
      strong: "var(--border-strong)",
      accent: "var(--accent-border)",
      transparent: "transparent",
    },
    outlineColor: {
      focus: "var(--shadow-focus)",
      transparent: "transparent",
    },
  },
});

// ── Typography ─────────────────────────────────────────────────────────────────
const typographyProperties = defineProperties({
  properties: {
    fontFamily: tokens.font,
    fontSize: tokens.textSize,
    fontWeight: { normal: "400", medium: "500", semibold: "600", bold: "700" },
    lineHeight: tokens.leading,
    letterSpacing: tokens.tracking,
    textAlign: ["left", "center", "right"],
    textTransform: ["none", "uppercase", "lowercase", "capitalize"],
    textDecoration: ["none", "underline", "line-through"],
    whiteSpace: ["nowrap", "normal", "pre", "pre-wrap"],
    textOverflow: ["ellipsis", "clip"],
  },
});

// ── Visual — borders, shadows, motion, z-index ────────────────────────────────
const visualProperties = defineProperties({
  conditions: {
    default: {},
    hover: { selector: "&:hover" },
    focus: { selector: "&:focus-visible" },
    active: { selector: "&:active" },
  },
  defaultCondition: "default",
  properties: {
    borderRadius: tokens.radius,
    boxShadow: {
      // Dynamic: shadow values vary between light/dark mode
      xs: "var(--shadow-xs)",
      sm: "var(--shadow-sm)",
      md: "var(--shadow-md)",
      focus: "var(--shadow-focus)",
      none: "none",
    },
    cursor: ["pointer", "default", "text", "not-allowed", "grab", "grabbing"],
    userSelect: ["none", "auto", "text", "all"],
    pointerEvents: ["none", "auto"],
    zIndex: {
      "0": "0",
      "10": "10",
      "20": "20",
      "50": "50",
      "100": "100",
      auto: "auto",
    },
    opacity: { "0": "0", "50": "0.5", "100": "1" },
    transition: tokens.transition,
  },
});

export const sprinkles = createSprinkles(
  responsiveProperties,
  colorProperties,
  typographyProperties,
  visualProperties,
);

export type Sprinkles = Parameters<typeof sprinkles>[0];
