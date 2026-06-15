/**
 * Primitive colour scales (mode-invariant).
 *
 * These are the raw, role-free palette ramps. This is the only place literal
 * hex lives. The semantic role and status dictionaries reference these, and
 * `global.css` mirrors them as CSS custom properties. Scale steps use string
 * keys so numeric positions never trip `no-magic-numbers`. The source of truth
 * is `the upstream design tokens file colors_and_type.css`.
 */

/** Brand accent — petrol teal. Logo + identity touches, NOT primary actions. */
export const teal = {
  "50": "#E6F3F3",
  "100": "#C5E4E5",
  "200": "#98D0D2",
  "300": "#5FB4B7",
  "400": "#2C9296",
  "500": "#0D7377",
  "600": "#0A5C60",
  "700": "#08484B",
  "800": "#06383A",
  "900": "#042A2C",
} as const;

/** Brand primary — deep indigo-azure. Actions; harmonises with promo violet. */
export const blue = {
  "50": "#ECF0FB",
  "100": "#D5DEF7",
  "200": "#AEC0EF",
  "300": "#7C98E2",
  "400": "#486ECB",
  "500": "#2350B5",
  "600": "#1E459C",
  "700": "#173372",
  "800": "#112752",
  "900": "#0C1C3A",
} as const;

/** Neutral — cool slate. Carries the admin tables, surfaces, and text. */
export const slate = {
  "0": "#FFFFFF",
  "50": "#F7F9FA",
  "100": "#EDF1F3",
  "200": "#DCE3E7",
  "300": "#C2CCD2",
  "400": "#97A4AD",
  "500": "#6B7A84",
  "600": "#4D5A63",
  "700": "#36424A",
  "800": "#232D34",
  "900": "#141B20",
  "950": "#0C1115",
} as const;

/** Promo accent — violet. Promotional rate + codes; never a status colour. */
export const violet = {
  "500": "#7C4DD6",
  fg: "#5B33A8",
  bg: "#F1EAFC",
  border: "#D9C6F4",
} as const;

export const white = "#FFFFFF" as const;
export const black = "#000000" as const;

/** Every primitive ramp, addressable as `palette.<family>.<step>`. */
export const palette = {
  teal,
  blue,
  slate,
  violet,
  white,
  black,
} as const;

export type Palette = typeof palette;
