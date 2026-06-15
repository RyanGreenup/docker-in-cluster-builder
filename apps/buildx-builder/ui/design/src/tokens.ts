/**
 * Design token constants — single source of truth for all static values.
 *
 * Static tokens (fonts, sizes, radii, spacing, motion) are defined here as
 * TypeScript constants so VE style() and sprinkles get typed auto-complete.
 *
 * Dynamic tokens (surfaces, borders, fg, accent) remain as CSS custom
 * properties on :root because they vary between light and dark mode.
 */

export const font = {
  sans: "'IBM Plex Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, 'SF Mono', 'Cascadia Code', monospace",
  /** Alias of mono for money, rates, and deposit references (tabular numerals). */
  num: "'IBM Plex Mono', ui-monospace, 'SF Mono', 'Cascadia Code', monospace",
} as const;

/** Font weight scale. */
export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

/**
 * Editorial type scale for the personal site. Body base is 15px (`md`); the
 * scale opens up at the top end (52/64px display) for hero headlines. The two
 * sub-12px steps (`3xs`/`2xs`) are retained from the lifted contract for dense
 * mono metadata; they are rarely used here.
 */
export const textSize = {
  // 10px
  "3xs": "0.625rem",
  // 11px
  "2xs": "0.6875rem",
  // 12px
  xs: "0.75rem",
  // 13px
  sm: "0.8125rem",
  // 15px, body base
  md: "0.9375rem",
  // 17px
  lg: "1.0625rem",
  // 20px
  xl: "1.25rem",
  // 24px
  "2xl": "1.5rem",
  // 31px
  "3xl": "1.9375rem",
  // 40px
  "4xl": "2.5rem",
  // 52px, display
  "5xl": "3.25rem",
  // 64px, hero display
  "6xl": "4rem",
} as const;

export const leading = {
  /** Display/hero headlines. */
  tight: "1.12",
  /** Card titles, compact headings. */
  snug: "1.3",
  /** Body copy. */
  normal: "1.6",
  /** Long-form reading column (prose, lede). */
  relaxed: "1.75",
  /** Mono blocks: code, references, IDs. */
  mono: "1.6",
} as const;

export const tracking = {
  tight: "-0.015em",
  normal: "0em",
  wide: "0.02em",
  /** Uppercase section labels (resume/skill headings). */
  caps: "0.08em",
  /** Mono uppercase kickers (eyebrows). */
  kicker: "0.16em",
  mono: "0.02em",
} as const;

export const radius = {
  none: "0",
  // 4px, chips
  sm: "0.25rem",
  // 6px, buttons, nav links, brand tile
  md: "0.375rem",
  // 8px, icon tiles, code blocks
  lg: "0.5rem",
  // 12px, cards
  xl: "0.75rem",
  // 16px, large surfaces
  "2xl": "1rem",
  pill: "999px",
  full: "50%",
} as const;

export const space = {
  "0": "0",
  // 4px
  "1": "0.25rem",
  // 8px
  "2": "0.5rem",
  // 12px
  "3": "0.75rem",
  // 16px
  "4": "1rem",
  // 20px
  "5": "1.25rem",
  // 24px
  "6": "1.5rem",
  // 32px
  "8": "2rem",
  // 40px
  "10": "2.5rem",
  // 48px
  "12": "3rem",
  // 64px, page rail top
  "16": "4rem",
  // 80px
  "20": "5rem",
  // 96px, section rhythm + rail bottom
  "24": "6rem",
  // 128px
  "32": "8rem",
  auto: "auto",
} as const;

/**
 * Reading-measure and rail widths for the editorial layout. `measure` caps a
 * single column of prose for legibility; `contentMax` is the page rail;
 * `proseMax` is the narrower long-form reading column (blog post, contact).
 */
export const layout = {
  measure: "68ch",
  contentMax: "64rem",
  proseMax: "42rem",
} as const;

export const duration = {
  fast: "120ms",
  base: "200ms",
  slow: "320ms",
} as const;

export const ease = {
  out: "cubic-bezier(0.2, 0, 0, 1)",
  inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  /** The default UI easing for colour/position transitions. */
  standard: "cubic-bezier(0.4, 0, 0.2, 1)",
  /** Staged page-load reveals (kicker, headline, lede rising in sequence). */
  reveal: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

// Derived transition presets

/** Elevation and focus-ring tokens. Light/dark pairs let mode-aware contracts auto-switch. */
export const shadow = {
  sm: "0 1px 3px rgba(20, 27, 32, 0.08), 0 1px 2px rgba(20, 27, 32, 0.04)",
  smDark: "0 1px 2px rgba(0, 0, 0, 0.40), 0 1px 3px rgba(0, 0, 0, 0.50)",
  md: "0 4px 12px rgba(20, 27, 32, 0.10), 0 1px 3px rgba(20, 27, 32, 0.06)",
  mdDark: "0 6px 18px rgba(0, 0, 0, 0.50), 0 1px 3px rgba(0, 0, 0, 0.40)",
  lg: "0 12px 32px rgba(20, 27, 32, 0.14), 0 4px 8px rgba(20, 27, 32, 0.06)",
  focus: "0 0 0 3px rgba(35, 80, 181, 0.40)",
  focusDark: "0 0 0 3px rgba(156, 192, 255, 0.45)",
} as const;

export const transition = {
  none: "none",
  fast: `background-color ${duration.fast} ${ease.out}, color ${duration.fast} ${ease.out}, border-color ${duration.fast} ${ease.out}, box-shadow ${duration.fast} ${ease.out}, transform ${duration.fast} ${ease.out}, opacity ${duration.fast} ${ease.out}`,
  base: `background-color ${duration.base} ${ease.out}, color ${duration.base} ${ease.out}, border-color ${duration.base} ${ease.out}, box-shadow ${duration.base} ${ease.out}, transform ${duration.base} ${ease.out}, opacity ${duration.base} ${ease.out}`,
  slow: `background-color ${duration.slow} ${ease.out}, color ${duration.slow} ${ease.out}, border-color ${duration.slow} ${ease.out}, box-shadow ${duration.slow} ${ease.out}, transform ${duration.slow} ${ease.out}, opacity ${duration.slow} ${ease.out}`,
  colors: `background-color ${duration.fast} ${ease.out}, color ${duration.fast} ${ease.out}, border-color ${duration.fast} ${ease.out}`,
  transform: `transform ${duration.base} ${ease.out}`,
} as const;

/**
 * Responsive breakpoints — the single source of truth for the width at which the
 * desktop layout takes over (sidebar becomes a static column; SplitGrid expands
 * from a stacked column into main + rail). The app shell and the SplitGrid recipe
 * both read this so they collapse at the same width by construction.
 */
export const breakpoint = {
  // 1024px — desktop layout (sidebar + rail) takes over.
  desktop: "1024px",
} as const;
