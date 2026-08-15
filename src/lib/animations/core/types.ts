export interface AnimationDef {
  keyframes: Keyframe[];
  options: KeyframeAnimationOptions;
}

export type AnimationName = "fade" | "zoom" | "slide" | "stagger" | "reveal" | "none";
