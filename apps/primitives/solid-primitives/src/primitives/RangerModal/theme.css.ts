import { createTheme, createThemeContract } from "@vanilla-extract/css";

/*
 * Theme contract for the RangerModal primitive.
 *
 * The component CSS reads only from this contract, never from raw `var(--x)`
 * strings, so the modal is theme-agnostic in the conventional vanilla-extract
 * way: one typed contract of CSS custom properties, then one `createTheme` per
 * skin. `rangerTheme` below is the built-in default ("the primitive design"); a
 * consumer (see the storybook Exemplar story) supplies an alternative by
 * calling `createTheme(rangerVars, { ... })` and passing the resulting class to
 * `RangerModal`'s `themeClass` prop.
 *
 * `createThemeContract` requires `null` leaf placeholders, so `unicorn/no-null`
 * is disabled for the contract literal only.
 */
/* eslint-disable unicorn/no-null -- createThemeContract mandates null leaf placeholders */
export const rangerVars = createThemeContract({
  accent: { base: null, border: null, soft: null },
  border: { default: null, subtle: null },
  ease: { out: null },
  fg: { muted: null, onAccent: null, primary: null, secondary: null, tertiary: null },
  font: { mono: null },
  radius: { lg: null, sm: null },
  sp: { lg: null, md: null, sm: null, xl: null, xs: null },
  surface: { base: null, hover: null, raised: null, sunken: null },
  tag: {
    amber: { bg: null, fg: null },
    cyan: { bg: null, fg: null },
    emerald: { bg: null, fg: null },
    neutral: { bg: null, fg: null },
    rose: { bg: null, fg: null },
    violet: { bg: null, fg: null },
  },
  text: { "2xs": null, md: null, sm: null, xs: null },
});
/* eslint-enable unicorn/no-null */

/** Tag families addressed by name from data (`note.tag`). */
export type RangerTag = keyof typeof rangerVars.tag;

/**
 * Runtime lookup so component code can resolve a tag colour from its name
 * without string-concatenating CSS variable names (the contract vars are
 * hashed, so `var(--tag-${name})` would not resolve).
 */
export const tagVars: Record<RangerTag, { fg: string; bg: string }> = {
  amber: rangerVars.tag.amber,
  cyan: rangerVars.tag.cyan,
  emerald: rangerVars.tag.emerald,
  neutral: rangerVars.tag.neutral,
  rose: rangerVars.tag.rose,
  violet: rangerVars.tag.violet,
};

/**
 * Built-in default skin: a cool-slate light surface with an indigo accent and
 * mono metadata, mirroring the component's native look.
 */
export const rangerTheme = createTheme(rangerVars, {
  accent: {
    base: "oklch(56% 0.17 264)",
    border: "oklch(64% 0.16 264 / 0.3)",
    soft: "oklch(64% 0.16 264 / 0.1)",
  },
  border: {
    default: "oklch(88% 0.006 250)",
    subtle: "oklch(92% 0.005 250)",
  },
  ease: { out: "cubic-bezier(0.2, 0, 0, 1)" },
  fg: {
    muted: "oklch(64% 0.011 250)",
    onAccent: "oklch(99.2% 0.002 250)",
    primary: "oklch(16.5% 0.009 250)",
    secondary: "oklch(33% 0.012 250)",
    tertiary: "oklch(52% 0.012 250)",
  },
  font: {
    mono: "ui-monospace, SFMono-Regular, 'JetBrains Mono', 'Cascadia Code', monospace",
  },
  radius: { lg: "0.625rem", sm: "0.3125rem" },
  sp: { lg: "1rem", md: "0.75rem", sm: "0.5rem", xl: "1.5rem", xs: "0.25rem" },
  surface: {
    base: "oklch(98.4% 0.003 250)",
    hover: "oklch(94.5% 0.005 250 / 0.7)",
    raised: "oklch(99.2% 0.002 250)",
    sunken: "oklch(96.8% 0.004 250)",
  },
  tag: {
    amber: { bg: "oklch(94% 0.04 75)", fg: "oklch(42% 0.1 75)" },
    cyan: { bg: "oklch(94% 0.04 220)", fg: "oklch(42% 0.1 220)" },
    emerald: { bg: "oklch(94% 0.04 156)", fg: "oklch(42% 0.1 156)" },
    neutral: { bg: "oklch(94.2% 0.005 250)", fg: "oklch(33% 0.012 250)" },
    rose: { bg: "oklch(94% 0.04 18)", fg: "oklch(42% 0.1 18)" },
    violet: { bg: "oklch(94% 0.04 290)", fg: "oklch(42% 0.1 290)" },
  },
  text: { "2xs": "0.656rem", md: "0.844rem", sm: "0.781rem", xs: "0.719rem" },
});
