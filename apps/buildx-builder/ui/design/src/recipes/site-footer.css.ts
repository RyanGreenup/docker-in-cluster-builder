import { style } from "@vanilla-extract/css";

import { vars } from "../theme.css";
import { font, space, textSize } from "../tokens";

/**
 * Site footer: a quiet bar with the name + role on the left, social links
 * centred, and a mono copyright line. Capped to the same 72rem rail as the
 * header. Links shift to brand-blue on hover. Colours from the typed contract.
 */
export const siteFooter = style({
  borderTop: `1px solid ${vars.roles.border.subtle}`,
  background: vars.roles.bg.surface,
});

export const footerInner = style({
  width: "100%",
  maxWidth: "72rem",
  marginInline: "auto",
  padding: `${space["8"]} ${space["6"]}`,
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: `${space["4"]} ${space["6"]}`,
});

export const footerMeta = style({
  display: "inline-flex",
  alignItems: "center",
  gap: space["2"],
  fontSize: textSize.sm,
  color: vars.roles.fg.muted,
});

export const footerName = style({
  fontWeight: "600",
  color: vars.roles.fg.base,
});

export const footerDot = style({
  color: vars.roles.fg.faint,
});

export const footerLinks = style({
  listStyle: "none",
  display: "flex",
  gap: space["4"],
  marginInline: "auto",
  "@media": {
    "screen and (max-width: 640px)": {
      marginInline: "0",
      width: "100%",
      order: 3,
    },
  },
});

export const footerLink = style({
  fontSize: textSize.sm,
  fontWeight: "500",
  color: vars.roles.fg.muted,
  transition: "color var(--duration-base) var(--ease-standard)",
  selectors: {
    "&:hover": { color: vars.roles.brand.primary },
  },
});

export const footerCopy = style({
  fontFamily: font.mono,
  fontSize: textSize.xs,
  color: vars.roles.fg.subtle,
});
