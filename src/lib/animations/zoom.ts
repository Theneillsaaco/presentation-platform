import type { AnimationDef } from "./core/types";

export const zoom: AnimationDef = {
  keyframes: [
    { opacity: 0, clipPath: "scale(0.92)" },
    { opacity: 1, clipPath: "scale(1)" },
  ],
  options: {
    duration: 350,
    easing: "cubic-bezier(0.05, 0.7, 0.1, 1)",
    fill: "both",
  },
};