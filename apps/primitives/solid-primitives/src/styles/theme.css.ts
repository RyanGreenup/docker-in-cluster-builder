// NOTE: the actual type is null, not much we can do to favour undefined
// oxlint-disable unicorn/no-null
import {
  createGlobalTheme,
  createGlobalThemeContract,
  globalKeyframes,
} from "@vanilla-extract/css";

const toKebabCase = (stringVal: string) =>
  stringVal.replaceAll(/[A-Z]/gu, (char) => `-${char.toLowerCase()}`);

/**
 * LOCAL DEMO SKIN. NOT THE CANONICAL DESIGN SYSTEM.
 *
 * These `vars` / `tokens` re-encode a sample brand palette only so the headless
 * primitives in `exemplars/` can be shown skinned. The authoritative design
 * contract lives in the consuming design system. Do not treat these values as a
 * source of truth and do not import them from product components: bind the
 * consuming design system's `theme` contract instead. This copy exists to
 * demonstrate that the headless primitives accept any skin.
 */
export const vars = createGlobalThemeContract(
  {
    color: {
      // A neo-brutalist riso-pop demo skin: flat fluoro inks printed on warm
      // paper, outlined in heavy ink, with hard offset shadows. Purely a sample
      // brand, swap it for the consuming design system's contract.
      pop: {
        ash: null,
        cloud: null,
        grape: null,
        ink: null,
        lime: null,
        marigold: null,
        paper: null,
        paperShade: null,
        pink: null,
        sky: null,
        tangerine: null,
      },
      // oxlint-disable-next-line sort-keys
      surface: {
        "50": null,
        "100": null,
        "200": null,
        "300": null,
        "400": null,
        "500": null,
        "600": null,
        "700": null,
        "800": null,
        "900": null,
        "950": null,
      },
    },
  },
  (_value, path) => path.map((segment) => toKebabCase(segment)).join("-"),
);

createGlobalTheme(":root", vars, {
  color: {
    pop: {
      ash: "#9a93a6",
      cloud: "#ffffff",
      grape: "#6c4cff",
      ink: "#15101f",
      lime: "#a6e22e",
      marigold: "#ffce26",
      paper: "#fff6ea",
      paperShade: "#f2e4d0",
      pink: "#ff4d6d",
      sky: "#34b3f1",
      tangerine: "#ff8a3d",
    },
    surface: {
      "100": "#fff6ea",
      "200": "#f7ead8",
      "300": "#ecd9bf",
      "400": "#d8c0a3",
      "50": "#fffaf2",
      "500": "#b09a82",
      "600": "#82705f",
      "700": "#574a3f",
      "800": "#332a26",
      "900": "#1f1922",
      "950": "#15101f",
    },
  },
});

export const tokens = createGlobalThemeContract(
  {
    aspect: {
      heroBanner: null,
      heroBannerFull: null,
    },
    breakpoint: {
      "2xl": null,
      lg: null,
      md: null,
      sm: null,
      xl: null,
    },
    container: {
      modal: null,
    },
    editor: {
      accent: { base: null, border: null, soft: null },
      border: { default: null, subtle: null },
      fg: { muted: null, primary: null, secondary: null },
      surface: { base: null, hover: null, raised: null, sunken: null },
    },
    font: {
      helvetica: null,
      mono: null,
      outfit: null,
      serif: null,
    },
    fontWeight: {
      bold: null,
      light: null,
      medium: null,
      normal: null,
      semibold: null,
    },
    lineHeight: {
      "2xl": null,
      "3xl": null,
      "4xl": null,
      "5xl": null,
      "6xl": null,
      "7xl": null,
      "8xl": null,
      "9xl": null,
      base: null,
      caption: null,
      lg: null,
      md: null,
      sm: null,
      xl: null,
      xs: null,
    },
    radius: {
      accordion: null,
      card: null,
    },
    shadow: {
      accordion: null,
      card: null,
      cardSoft: null,
    },
    spacing: {
      accordion: {
        block: null,
        contentBlockEnd: null,
        contentBlockStart: null,
        contentInline: null,
        inline: null,
      },
      headerHeight: null,
    },
    text: {
      "2xl": null,
      "3xl": null,
      "4xl": null,
      "5xl": null,
      "6xl": null,
      "7xl": null,
      "8xl": null,
      "9xl": null,
      base: null,
      caption: null,
      lg: null,
      md: null,
      sm: null,
      xl: null,
      xs: null,
    },
    ui: {
      primary: null,
      secondary: null,
    },
    // oxlint-disable-next-line id-length
    z: {
      header: null,
      navContent: null,
      navDropdown: null,
      navOverlay: null,
    },
  },
  (_value, path) => path.map((segment) => toKebabCase(segment)).join("-"),
);

createGlobalTheme(":root", tokens, {
  aspect: {
    heroBanner: "1440 / 349",
    heroBannerFull: "1440 / 772",
  },
  breakpoint: {
    "2xl": "1640px",
    lg: "1080px",
    md: "768px",
    sm: "640px",
    xl: "1280px",
  },
  container: {
    modal: "51rem",
  },
  editor: {
    accent: {
      base: "#ff4d6d",
      border: "color-mix(in oklab, #ff4d6d 45%, #fff6ea)",
      soft: "color-mix(in oklab, #ff4d6d 16%, #fff6ea)",
    },
    border: { default: "#d8c0a3", subtle: "#ecd9bf" },
    fg: { muted: "#82705f", primary: "#15101f", secondary: "#574a3f" },
    surface: {
      base: "#fff6ea",
      hover: "#f7ead8",
      raised: "#fffaf2",
      sunken: "#f7ead8",
    },
  },
  font: {
    helvetica: "Helvetica, Arial, sans-serif",
    mono: 'ui-monospace, "SF Mono", "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace',
    outfit:
      "'Outfit Variable', 'Outfit', Helvetica, Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
    serif: 'Georgia, "Iowan Old Style", "Times New Roman", Times, serif',
  },
  fontWeight: {
    bold: "700",
    light: "300",
    medium: "500",
    normal: "400",
    semibold: "600",
  },
  lineHeight: {
    "2xl": "1.75rem",
    "3xl": "2.1875rem",
    "4xl": "2.5rem",
    "5xl": "3.25rem",
    "6xl": "3.25rem",
    "7xl": "3.875rem",
    "8xl": "3.875rem",
    "9xl": "3.875rem",
    base: "1.125rem",
    caption: "1.0625rem",
    lg: "1.5625rem",
    md: "1.4375rem",
    sm: "1.125rem",
    xl: "1.875rem",
    xs: "1.1875rem",
  },
  radius: {
    accordion: tokens.radius.card,
    card: "10px",
  },
  shadow: {
    accordion: tokens.shadow.card,
    card: "0px 4px 20px 0px rgba(0, 0, 0, 0.25)",
    cardSoft: "0px 4px 20px 0px rgba(0, 0, 0, 0.12)",
  },
  spacing: {
    accordion: {
      block: "1.8125rem",
      contentBlockEnd: "4.375rem",
      contentBlockStart: "3.125rem",
      contentInline: "3.125rem",
      inline: "2.125rem",
    },
    headerHeight: "4rem",
  },
  text: {
    "2xl": "1.5625rem",
    "3xl": "1.875rem",
    "4xl": "2.1875rem",
    "5xl": "2.5rem",
    "6xl": "2.8125rem",
    "7xl": "3.125rem",
    "8xl": "3.4375rem",
    "9xl": "3.75rem",
    base: "1rem",
    caption: "0.9375rem",
    lg: "1.25rem",
    md: "1.125rem",
    sm: "0.875rem",
    xl: "1.375rem",
    xs: "0.8125rem",
  },
  ui: {
    primary: vars.color.pop.pink,
    secondary: vars.color.pop.grape,
  },
  // oxlint-disable-next-line id-length
  z: {
    header: "40",
    navContent: "3",
    navDropdown: "1",
    navOverlay: "2",
  },
});

export const transition = "300ms ease-in-out";

globalKeyframes("slide-down", {
  from: { transform: "translateY(-100%)" },
  to: { transform: "translateY(0)" },
});

globalKeyframes("slide-up", {
  from: { transform: "translateY(0)" },
  to: { transform: "translateY(-100%)" },
});
