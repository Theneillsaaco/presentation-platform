import type { AnimationDef } from "./core/types";

export const fade: AnimationDef = {
  keyframes: [
    { opacity: 0 },
    { opacity: 1 },
  ],
  options: {
    duration: 300,
    easing: "cubic-bezier(0.2, 0, 0, 1)",
    fill: "both",
  },
};