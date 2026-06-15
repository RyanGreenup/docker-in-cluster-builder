import { globalStyle, keyframes, style } from "@vanilla-extract/css";

// ===========================================================================
// "Card Catalog" skin for the headless Tree primitive.
//
// Nothing in @rs/solid-primitives changes. Every rule below targets the Zag
// data-part attributes the primitive already emits (root, tree, branch-control,
// branch-text, branch-indicator, branch-content, item, item-text) plus the
// data-selected / data-state / data-depth attributes. This is the whole point
// of a headless primitive: the behaviour, ARIA and keyboard handling are fixed,
// the entire look is authored here from the outside.
// ===========================================================================

const PAPER = "#ece0c4";
const PAPER_HI = "#f5ecd6";
const INK = "#2c2117";
const INK_SOFT = "#6a5740";
const INK_FAINT = "#8c785c";
const OXBLOOD = "#7c2b25";
const OXBLOOD_DEEP = "#561813";
const BRASS = "#b48a44";
const RULE = "rgba(106, 87, 64, 0.26)";
const RULE_SOFT = "rgba(106, 87, 64, 0.14)";
const WASH = "rgba(124, 43, 37, 0.10)";

const SERIF = "'Newsreader', Georgia, serif";
const DISPLAY = "'Cormorant Garamond', Georgia, serif";
const TYPE = "'Special Elite', 'Courier New', monospace";

const rise = keyframes({
  from: { opacity: 0, transform: "translateY(10px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

const stampIn = keyframes({
  "0%": { opacity: 0, transform: "scale(1.25) rotate(-4deg)" },
  "60%": { opacity: 1, transform: "scale(0.94) rotate(-4deg)" },
  "100%": { opacity: 1, transform: "scale(1) rotate(-4deg)" },
});

// ---------------------------------------------------------------------------
// The drawer frame (story chrome around the primitive)
// ---------------------------------------------------------------------------

export const stage = style({
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: "56px 24px",
  background: `
    radial-gradient(130% 90% at 50% -20%, #4a3a2a 0%, #2c2016 46%, #1c140d 100%)
  `,
  fontFamily: SERIF,
});

export const drawer = style({
  position: "relative",
  width: "min(27rem, 92vw)",
  borderRadius: "5px",
  padding: "10px",
  background: `
    linear-gradient(180deg, #7a5a36, #5e4226 64%, #4a3320)
  `,
  boxShadow: `
    0 1px 0 rgba(255, 236, 200, 0.35) inset,
    0 30px 60px -28px rgba(0, 0, 0, 0.85),
    0 8px 22px -16px rgba(0, 0, 0, 0.7)
  `,
  animation: `${rise} 640ms cubic-bezier(0.16, 1, 0.3, 1) both`,
});

// Brass drawer pull, centred under the label plate.
export const pull = style({
  position: "absolute",
  top: "118px",
  left: "50%",
  width: "78px",
  height: "16px",
  transform: "translateX(-50%)",
  borderRadius: "10px",
  background: `linear-gradient(180deg, #e6c074, ${BRASS} 52%, #7c5a26)`,
  boxShadow: `
    0 1px 0 rgba(255, 245, 214, 0.7) inset,
    0 -1px 0 rgba(0, 0, 0, 0.35) inset,
    0 3px 6px -2px rgba(0, 0, 0, 0.55)
  `,
});

// The aged paper card sitting inside the wooden drawer. This is the element
// That actually wraps the TreeView, so the data-part rules below hang off it.
export const catalog = style({
  position: "relative",
  borderRadius: "3px",
  padding: "20px 0 8px",
  color: INK,
  overflow: "hidden",
  backgroundColor: PAPER,
  backgroundImage: `
    radial-gradient(120% 70% at 50% -8%, ${PAPER_HI}, rgba(245, 236, 214, 0) 62%),
    radial-gradient(140% 120% at 50% 120%, rgba(43, 33, 24, 0.12), transparent 60%),
    repeating-linear-gradient(0deg, rgba(106, 87, 64, 0.04) 0 1px, transparent 1px 4px),
    repeating-linear-gradient(90deg, rgba(106, 87, 64, 0.03) 0 1px, transparent 1px 5px)
  `,
  boxShadow: `
    0 0 0 1px ${OXBLOOD_DEEP},
    0 0 0 4px ${PAPER},
    0 0 0 5px rgba(180, 138, 68, 0.55),
    0 14px 30px -18px rgba(0, 0, 0, 0.6) inset
  `,
});

// Hairline inner keyline (the catalogue card border).
globalStyle(`${catalog}::before`, {
  content: '""',
  position: "absolute",
  inset: "7px",
  border: `1px solid ${RULE}`,
  borderRadius: "2px",
  pointerEvents: "none",
});

export const plate = style({
  position: "relative",
  textAlign: "center",
  padding: "0 24px 14px",
  marginBottom: "6px",
  borderBottom: `1px solid ${RULE}`,
});

export const eyebrow = style({
  margin: 0,
  fontFamily: TYPE,
  fontSize: "10px",
  letterSpacing: "0.42em",
  textIndent: "0.42em",
  textTransform: "uppercase",
  color: OXBLOOD,
});

export const title = style({
  margin: "2px 0 0",
  fontFamily: DISPLAY,
  fontWeight: 600,
  fontStyle: "italic",
  fontSize: "42px",
  lineHeight: 1.02,
  letterSpacing: "0.005em",
  color: INK,
});

export const sub = style({
  margin: "4px 0 0",
  fontFamily: TYPE,
  fontSize: "11px",
  letterSpacing: "0.12em",
  color: INK_SOFT,
});

export const footer = style({
  display: "flex",
  justifyContent: "space-between",
  gap: "2px",
  margin: "8px 18px 4px",
  paddingTop: "10px",
  borderTop: `1px solid ${RULE}`,
  fontFamily: TYPE,
  fontSize: "10px",
  letterSpacing: "0.08em",
  color: INK_FAINT,
});

export const tab = style({
  selectors: {
    "&[data-on='true']": {
      color: PAPER,
      background: OXBLOOD,
      padding: "1px 4px",
      borderRadius: "2px",
    },
  },
});

// ---------------------------------------------------------------------------
// Reskin of the primitive internals via Zag data-part attributes
// ---------------------------------------------------------------------------

// Tree container: typographic baseline + a touch more horizontal room.
globalStyle(`${catalog} [data-part="tree"]`, {
  padding: "2px 16px 2px 14px",
  fontFamily: SERIF,
});

// Custom thin brass scrollbar on the horizontal scroll wrapper.
globalStyle(`${catalog} ::-webkit-scrollbar`, { height: "8px", width: "8px" });
globalStyle(`${catalog} ::-webkit-scrollbar-track`, { background: "transparent" });
globalStyle(`${catalog} ::-webkit-scrollbar-thumb`, {
  background: "rgba(180, 138, 68, 0.5)",
  borderRadius: "8px",
  border: "2px solid transparent",
  backgroundClip: "padding-box",
});

// Every row (branch header and leaf). Flatten the pill into a ledger line.
globalStyle(`${catalog} [data-part="branch-control"], ${catalog} [data-part="item"]`, {
  position: "relative",
  borderRadius: 0,
  padding: "7px 10px 7px 6px",
  gap: "9px",
  color: INK,
  background: "transparent",
  borderBottom: `1px solid ${RULE_SOFT}`,
  fontFamily: SERIF,
  fontSize: "15px",
  transition: "background 200ms ease, color 200ms ease, padding-left 200ms ease",
});

// Hover: a warm wash and a small rightward settle, as if a card is being drawn.
globalStyle(`${catalog} [data-part="branch-control"]:hover, ${catalog} [data-part="item"]:hover`, {
  background: "rgba(180, 138, 68, 0.12)",
  color: OXBLOOD_DEEP,
  paddingLeft: "10px",
});

// Folder rows read as manila dividers: slightly heavier, small-caps flavour.
globalStyle(`${catalog} [data-part="branch-text"]`, {
  fontWeight: 600,
  fontSize: "15px",
  letterSpacing: "0.01em",
  color: INK,
});

// Leaf rows read as filed cards: lighter, italic, set in the body serif.
globalStyle(`${catalog} [data-part="item-text"]`, {
  fontWeight: 400,
  fontStyle: "italic",
  color: INK_SOFT,
});

// Selected card: oxblood wash, an inked "filed" bar on the left edge, deep ink.
globalStyle(
  `${catalog} [data-part="branch-control"][data-selected], ${catalog} [data-part="item"][data-selected]`,
  {
    background: WASH,
    color: OXBLOOD_DEEP,
    boxShadow: `inset 3px 0 0 ${OXBLOOD}`,
  },
);
globalStyle(`${catalog} [data-part="item"][data-selected] [data-part="item-text"]`, {
  color: OXBLOOD_DEEP,
  fontStyle: "italic",
});

// Chevron: small oxblood mark. Rotation is still driven by the primitive.
globalStyle(`${catalog} [data-part="branch-indicator"]`, {
  color: OXBLOOD,
  opacity: 0.8,
});
globalStyle(`${catalog} [data-part="branch-indicator"] svg`, {
  width: "8px",
  height: "8px",
});

// Folder / file glyphs (the primitive's inline SVGs, direct children of a row).
globalStyle(`${catalog} [data-part="branch-control"] > svg`, {
  color: OXBLOOD,
  opacity: 0.85,
});
globalStyle(`${catalog} [data-part="item"] > svg`, {
  color: INK_FAINT,
  opacity: 0.85,
});

// Call-number badge (the count span that follows the label). Stamp it.
globalStyle(
  `${catalog} [data-part="branch-text"] + span, ${catalog} [data-part="item-text"] + span`,
  {
    fontFamily: TYPE,
    fontSize: "10px",
    letterSpacing: "0.06em",
    color: OXBLOOD,
    padding: "1px 5px",
    border: `1px solid rgba(124, 43, 37, 0.4)`,
    borderRadius: "2px",
    transform: "rotate(-4deg)",
    animation: `${stampIn} 360ms ease both`,
  },
);
globalStyle(
  `${catalog} [data-selected] [data-part="branch-text"] + span, ${catalog} [data-selected] [data-part="item-text"] + span`,
  { color: PAPER, background: OXBLOOD, borderColor: OXBLOOD },
);

// Indent: the child group becomes a "catalogue rod" hanging down the left.
globalStyle(`${catalog} [data-part="branch-content"]`, {
  marginLeft: "14px",
  paddingLeft: "12px",
  borderLeft: `1px dotted ${RULE}`,
});
