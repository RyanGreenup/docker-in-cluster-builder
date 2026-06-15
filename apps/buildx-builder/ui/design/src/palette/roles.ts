/**
 * Semantic colour roles (theme-dependent).
 *
 * Surface, text, brand and accent roles. These mirror the CSS custom
 * properties defined in `global.css` (`--surface-*`, `--fg-*`, `--accent*`,
 * `--border-*`). The dictionary is the typed, documented source those vars
 * are transcribed from. Light maps onto the slate/blue ramps; dark uses
 * hand-tuned values (lighter primary + dark on-colour) for accessible pairing.
 */

import { blue, slate, teal, white } from "./primitives";

// type required: interface lacks an index signature so it can't satisfy
// vanilla-extract NullableTokens
// eslint-disable-next-line typescript/consistent-type-definitions
export type ColorRoles = {
  bg: {
    app: string;
    surface: string;
    raised: string;
    sunken: string;
    hover: string;
  };
  border: {
    base: string;
    strong: string;
    /** Faint row divider (slate-100 light). Used by table cell border-bottom. */
    subtle: string;
  };
  fg: {
    base: string;
    muted: string;
    subtle: string;
    onDark: string;
    /** Resting sort/filter glyph colour (slate-400 light). Used by table header mini-buttons. */
    faint: string;
  };
  brand: {
    primary: string;
    primaryHover: string;
    primaryActive: string;
    primarySubtle: string;
    onPrimary: string;
    ring: string;
    /** Active-filter outline colour (blue-200 light). Used by table filter button border. */
    primaryBorder: string;
  };
  accent: string;
  /**
   * Petrol-teal accent with strong tone (teal-700 light / teal-300 dark).
   * Used for the quote-card net footer text and values.
   */
  accentStrong: string;
  /**
   * Petrol-teal accent with subtle tone (teal-100 light / teal-800 dark).
   * Used for the quote-card net footer border.
   */
  accentSubtle: string;
  focusRing: string;
  /**
   * The auth screen's marketing brand panel **always-dark**
   * surface (deep navy with white text and a teal highlight), identical in light
   * and dark mode. Modelled in the contract so the auth recipes are semantic and hex-free;
   * white-muted overlays on top stay as `rgba(255,255,255,…)` literals.
   */
  brandPanel: {
    /** Deep navy panel background (blue-900). */
    bg: string;
    /** Teal highlight headline emphasis, the live-rate dot, trust icons. */
    accent: string;
    /** Primary text colour on the panel (white). */
    onBg: string;
  };
};

/** Light theme (default, applied on :root). */
export const rolesLight: ColorRoles = {
  bg: {
    app: slate["50"],
    surface: white,
    raised: white,
    sunken: slate["100"],
    hover: slate["100"],
  },
  border: {
    base: slate["200"],
    strong: slate["300"],
    subtle: slate["100"], // #EDF1F3 : faint row divider for table cells
  },
  fg: {
    base: slate["900"],
    muted: slate["600"],
    subtle: slate["500"],
    onDark: white,
    faint: slate["400"], // #97A4AD : resting sort/filter glyph colour
  },
  brand: {
    primary: blue["500"],
    primaryHover: blue["600"],
    primaryActive: blue["700"],
    primarySubtle: blue["50"],
    onPrimary: "#FFFFFF",
    ring: "color-mix(in srgb, #2350B5 45%, transparent)",
    primaryBorder: blue["200"], // #AEC0EF : active-filter outline
  },
  accent: "#0D7377",
  accentStrong: teal["700"], // #08484B : dark petrol-teal; legible on light net-footer
  accentSubtle: teal["100"], // #C5E4E5 : light teal border for net-footer
  focusRing: blue["500"],
  brandPanel: {
    bg: blue["900"], // #0C1C3A : deep navy (always-dark auth panel)
    accent: teal["300"], // #5FB4B7 : teal highlight on the navy panel
    onBg: white, // #FFFFFF : primary text on the panel
  },
};

/** Dark theme (admin default; cool-neutral slate with clear elevation steps). */
export const rolesDark: ColorRoles = {
  bg: {
    app: "#0E1217",
    surface: "#161B22",
    raised: "#1C232C",
    sunken: "#0B0F14",
    hover: "#222A33",
  },
  border: {
    base: "#2A323B",
    strong: "#3B454F",
    subtle: "#222A31", // slightly darker than border.base : faint row divider in dark mode
  },
  fg: {
    base: "#E6EAEE",
    muted: "#AEB7C0",
    subtle: "#8A949E",
    onDark: white,
    faint: "#6A747D", // muted icon colour in dark mode
  },
  brand: {
    primary: "#9CC0FF",
    primaryHover: "#B4D0FF",
    primaryActive: "#C8DDFF",
    primarySubtle: "#18263C",
    onPrimary: "#08213F",
    ring: "color-mix(in srgb, #9CC0FF 55%, transparent)",
    primaryBorder: "#5A7FC0", // ~3.8:1 contrast on primarySubtle #18263C : active-filter outline
  },
  accent: "#1FA3A8",
  accentStrong: teal["300"], // #5FB4B7 : light teal; legible on dark net-footer bg
  accentSubtle: teal["800"], // #06383A : deep teal border for dark net-footer
  focusRing: "#9CC0FF",
  brandPanel: {
    bg: blue["900"], // #0C1C3A : same navy in dark mode (panel is always dark)
    accent: teal["300"], // #5FB4B7
    onBg: white, // #FFFFFF
  },
};
