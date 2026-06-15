import { style } from "@vanilla-extract/css";

import { tokens, vars } from "../../styles/theme.css";

// The original component consumed raw host-app custom properties
// (--fg-secondary, --surface-hover, --accent, --sp-2, --dur-fast, ...). Those
// Are not part of this package's theme contract, so each is mapped to the
// `vars`/`tokens` contract from styles/theme.css where an equivalent exists,
// And to a local constant otherwise (the demo contract has no duration, mono
// Font, or generic spacing scale tokens).
const FAST = "150ms ease";
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

// ── Container ─────────────────────────────────────────────────────────────────

// Block-level scroll container wrapping folderTree. Keeping the scroll
// Container as a plain block div (not a flex container) is critical: flex
// Layout does not propagate cross-axis overflow to the scroll container, so
// Putting overflow:auto on the flex column directly never shows a horizontal
// Scrollbar even when nested rows exceed the panel width.
export const treeScrollWrapper = style({
  overflowX: "auto",
  overflowY: "hidden",
  overscrollBehaviorX: "contain",
  scrollbarWidth: "thin",
});

export const folderTree = style({
  // Grid instead of flex: grid computes max-content from actual block content
  // (recursively through nested treeChildren indents), while flex-column
  // Computes max-content from stretched item widths, creating a circular
  // Dependency that prevents the container from expanding past parent width.
  display: "grid",
  // Minmax(max-content, 1fr): column is at least max-content wide (deepest
  // Indented row drives this), but fills the wrapper when content is narrow.
  // When max-content > 1fr, the column overflows treeScrollWrapper, showing a
  // Horizontal scrollbar.
  gridTemplateColumns: "minmax(max-content, 1fr)",
  gap: "1px",
  padding: "0 0.5rem",
});

// ── Visually-hidden label (a11y, not rendered visually) ───────────────────────

export const srOnly = style({
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  borderWidth: 0,
});

// ── Row (branch control / leaf item) ─────────────────────────────────────────
// Zag spreads data-selected onto this element; use attribute selectors so no
// Extra JS state is needed.

export const treeItemRow = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "5px 0.5rem",
  borderRadius: "6px",
  cursor: "pointer",
  // Prevents the row from compressing below its content width as nesting depth
  // Increases. Without this, the block formatting context shrinks the row to fit
  // Each indentation level, and the flex items (including label) just fill the
  // Compressed width instead of overflowing folderTree for horizontal scroll.
  minWidth: "max-content",
  transition: `background ${FAST}, color ${FAST}`,
  fontSize: tokens.text.sm,
  color: vars.color.surface["700"],
  userSelect: "none",
  WebkitUserSelect: "none",

  selectors: {
    "&:hover": {
      background: vars.color.surface["200"],
      color: vars.color.surface["900"],
    },
    "&[data-selected]": {
      background: "rgba(108, 76, 255, 0.12)",
      color: vars.color.pop.grape,
      fontWeight: 500,
    },
    "&[data-selected]:hover": {
      background: "rgba(108, 76, 255, 0.2)",
    },
  },

  "@media": {
    "screen and (max-width: 720px)": {
      padding: "9px 0.5rem",
      fontSize: tokens.text.md,
    },
  },
});

// ── Chevron indicator (rotates via zag's data-state="open") ───────────────────

export const chevronIndicator = style({
  width: "14px",
  height: "14px",
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
  color: vars.color.surface["600"],
  transition: `transform ${FAST}`,

  selectors: {
    '&[data-state="open"]': { transform: "rotate(90deg)" },
    // Leaf placeholder: zag does not render getBranchIndicatorProps for leaves,
    // But a hidden spacer keeps column alignment intact.
    '&[data-state="closed"]': { transform: "rotate(0deg)" },
  },
});

// Hidden spacer matching chevron width, keeps leaf rows aligned with branches.
export const chevronSpacer = style({
  width: "14px",
  flexShrink: 0,
});

// ── Folder / file icon ────────────────────────────────────────────────────────

export const nodeIcon = style({
  opacity: 0.75,
  flexShrink: 0,

  selectors: {
    "[data-selected] &": { opacity: 1 },
  },
});

// ── Label ─────────────────────────────────────────────────────────────────────

export const itemLabel = style({
  // Grow: fills remaining row space so the count badge stays right-aligned.
  // Will not compress below natural text width, so long names cause
  // The row to exceed folderTree's width, triggering horizontal scroll.
  flex: "1 0 auto",
  whiteSpace: "nowrap",
});

// ── Count badge ───────────────────────────────────────────────────────────────

export const itemCount = style({
  fontFamily: MONO,
  fontSize: "0.6875rem",
  color: vars.color.surface["500"],
  fontVariantNumeric: "tabular-nums",

  selectors: {
    "[data-selected] &": { color: vars.color.pop.grape, opacity: 0.7 },
  },

  "@media": {
    "screen and (max-width: 720px)": { fontSize: tokens.text.xs },
  },
});

// ── Children container ────────────────────────────────────────────────────────

export const treeChildren = style({
  paddingLeft: "14px",
});
