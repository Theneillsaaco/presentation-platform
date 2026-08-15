import type { AnimationDef } from "./core/types";

export const reveal: AnimationDef = {
  keyframes: [
    { opacity: 0, clipPath: "inset(0 0 100% 0)" },
    { opacity: 1, clipPath: "inset(0 0 0% 0)" },
  ],
  options: {
    duration: 450,
    easing: "cubic-bezier(0.3, 0, 0.8, 0.15)",
    fill: "both",
  },
};