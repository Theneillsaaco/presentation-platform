import type { AnimationDef } from "./core/types";

export const slide: AnimationDef = {
  keyframes: [
    { opacity: 0, clipPath: "translateY(24px)" },
    { opacity: 1, clipPath: "translateY(0)" },
  ],
  options: {
    duration: 350,
    easing: "cubic-bezier(0.05, 0.7, 0.1, 1)",
    fill: "both",
  },
};