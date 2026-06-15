import { globalStyle, style } from "@vanilla-extract/css";

import { vars } from "../theme.css";
import { fontWeight } from "../tokens";

/**
 * Bio paragraph shown at the top of the resume, inside the "Summary" CvSection.
 * Renders a wide-measure paragraph with accent-coloured highlight spans (.hl).
 *
 * The .hl child class is styled via globalStyle so consumers can write plain
 * <span class="hl"> in JSX or Astro without importing a separate token.
 */
export const resumeSummary = style({
  fontSize: "1.25rem",
  lineHeight: 1.75,
  color: vars.roles.fg.base,
  maxWidth: "68ch",
});

globalStyle(`${resumeSummary} .hl`, {
  color: vars.roles.brand.primary,
  fontWeight: fontWeight.medium,
});
