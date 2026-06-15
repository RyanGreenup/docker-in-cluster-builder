import { keyframes } from "@vanilla-extract/css";

export const fadeIn = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });

export const riseIn = keyframes({
  from: { opacity: 0, transform: "translateY(8px) scale(0.98)" },
  to: { opacity: 1, transform: "translateY(0) scale(1)" },
});
