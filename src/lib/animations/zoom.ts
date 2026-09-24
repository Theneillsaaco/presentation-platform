import type { AnimationDef } from "./core/types";

export const zoom: AnimationDef = {
  keyframes: [
    { opacity: 0, transform: "scale(0.92)" },
    { opacity: 1, transform: "scale(1)" },
  ],
  options: { duration: 350, easing: "cubic-bezier(0.05, 0.7, 0.1, 1)", fill: "both" },
};
