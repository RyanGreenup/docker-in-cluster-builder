import { style } from "@vanilla-extract/css";

import { vars } from "../theme.css";
import { font, textSize, tracking } from "../tokens";

/**
 * The eyebrow / kicker: a small uppercase mono label that sits above a hero or
 * page title (e.g. "SENIOR SOFTWARE ENGINEER . SYSTEMS & WEB"). Wide kicker
 * tracking gives the all-caps mono label air; the petrol-teal accent-strong
 * tone keeps it quiet but distinct from the brand-blue used on actions. Colour
 * reads from the typed contract, so it flips in dark mode.
 */
export const kicker = style({
  display: "inline-block",
  fontFamily: font.mono,
  fontSize: textSize.xs,
  fontWeight: "500",
  textTransform: "uppercase",
  letterSpacing: tracking.kicker,
  color: vars.roles.accentStrong,
});
