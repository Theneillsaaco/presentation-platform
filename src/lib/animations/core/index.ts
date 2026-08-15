import { fade } from "../fade";
import { zoom } from "../zoom";
import { slide } from "../slide";
import { stagger, staggerDelay } from "../stagger";
import { reveal } from "../reveal";
import type { AnimationDef, AnimationName } from "./types";

export const animations: Record<Exclude<AnimationName, "none">, AnimationDef> = {
  fade,
  zoom,
  slide,
  stagger,
  reveal,
};

export { staggerDelay };
export type { AnimationDef, AnimationName };
