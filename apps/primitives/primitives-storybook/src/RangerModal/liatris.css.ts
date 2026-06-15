import { font, radius, space, textSize } from "@rs/liatris-design";
import { createRangerTheme } from "@rs/solid-primitives/ranger-theme";

/*
 * A second skin for the RangerModal primitive, built the conventional
 * vanilla-extract way over the exported `rangerVars` contract (via the
 * `createRangerTheme` factory). Static tokens (font, type scale, radius,
 * spacing) come straight from the @rs/liatris-design token module; the dynamic
 * colour roles reference the custom properties that @rs/liatris-design/global.css
 * publishes on :root, so the modal flips with the site's light/dark theme for
 * free. Tags have no counterpart in the design package, so they are supplied
 * directly as oklch values.
 */
export const liatrisRangerTheme = createRangerTheme({
  accent: {
    base: "var(--accent)",
    border: "var(--accent-border)",
    soft: "var(--accent-soft)",
  },
  border: {
    default: "var(--border-default)",
    subtle: "var(--border-subtle)",
  },
  ease: { out: "var(--ease-out)" },
  fg: {
    muted: "var(--fg-muted)",
    onAccent: "var(--fg-on-accent)",
    primary: "var(--fg-primary)",
    secondary: "var(--fg-secondary)",
    tertiary: "var(--fg-tertiary)",
  },
  font: { mono: font.mono },
  radius: { lg: radius.lg, sm: radius.sm },
  sp: {
    lg: space["4"],
    md: space["3"],
    sm: space["2"],
    xl: space["6"],
    xs: space["1"],
  },
  surface: {
    base: "var(--surface-base)",
    hover: "var(--surface-hover)",
    raised: "var(--surface-raised)",
    sunken: "var(--surface-sunken)",
  },
  tag: {
    amber: { bg: "oklch(94% 0.04 75)", fg: "oklch(42% 0.1 75)" },
    cyan: { bg: "oklch(94% 0.04 220)", fg: "oklch(42% 0.1 220)" },
    emerald: { bg: "oklch(94% 0.04 156)", fg: "oklch(42% 0.1 156)" },
    neutral: { bg: "var(--surface-sunken)", fg: "var(--fg-secondary)" },
    rose: { bg: "oklch(94% 0.04 18)", fg: "oklch(42% 0.1 18)" },
    violet: { bg: "oklch(94% 0.04 290)", fg: "oklch(42% 0.1 290)" },
  },
  text: {
    "2xs": textSize["2xs"],
    md: textSize.md,
    sm: textSize.sm,
    xs: textSize.xs,
  },
});
