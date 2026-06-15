import { keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

/**
 * Staged page-load reveal. Elements rise a few pixels while fading in, on the
 * gentle `reveal` easing (no overshoot). Apply `reveal` to each item in a hero
 * or section and set an increasing `--reveal-delay` (about 60 to 90ms steps)
 * for the staggered cascade. The whole sequence is short (about 500 to 700ms)
 * and is fully disabled under `prefers-reduced-motion` so motion-sensitive
 * users see the final state immediately.
 */
const riseIn = keyframes({
  from: { opacity: 0, transform: "translateY(8px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

export const reveal = recipe({
  base: {
    animationName: riseIn,
    animationDuration: "560ms",
    animationTimingFunction: "var(--ease-reveal)",
    animationFillMode: "both",
    animationDelay: "var(--reveal-delay, 0ms)",
    "@media": {
      "(prefers-reduced-motion: reduce)": {
        animation: "none",
        opacity: 1,
        transform: "none",
      },
    },
  },
  variants: {
    // Convenience step delays for a five-item cascade (kicker, headline, lede,
    // cta, meta). Use these or set `--reveal-delay` inline.
    step: {
      0: { vars: { "--reveal-delay": "0ms" } },
      1: { vars: { "--reveal-delay": "80ms" } },
      2: { vars: { "--reveal-delay": "160ms" } },
      3: { vars: { "--reveal-delay": "240ms" } },
      4: { vars: { "--reveal-delay": "320ms" } },
    },
  },
});

/** A flex child that grows to push siblings apart (header/footer spacer). */
export const pushRight = style({ marginInlineStart: "auto" });
