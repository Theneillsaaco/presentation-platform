import type { AnimationDef } from "./core/types";

export const stagger: AnimationDef = {
  keyframes: [
    { opacity: 0, transform: "translateY(16px)" },
    { opacity: 1, transform: "translateY(0)" },
  ],
  options: { duration: 300, easing: "cubic-bezier(0.2, 0, 0, 1)", fill: "both" },
};

/** Milliseconds of delay to apply to the nth staggered child. */
export function staggerDelay(index: number, step = 70): number {
  return index * step;
}
