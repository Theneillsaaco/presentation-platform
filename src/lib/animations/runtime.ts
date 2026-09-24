import { animations, staggerDelay, type AnimationName } from "./core";

/**
 * Slide entrance animations.
 *
 * Reveal.js mounts every slide up front, so animating on mount (what the old
 * AnimatedCard island did) plays everything once at page load, while the
 * slide is still hidden. Instead, init.ts calls playSlide() whenever a slide
 * becomes current and resetSlide() when it leaves, so the animation replays
 * on every visit. Zero JS per slide: SlideFrame only emits data attributes.
 */
const running = new WeakMap<Element, Animation[]>();

function frameOf(section?: HTMLElement | null): HTMLElement | null {
  return section?.querySelector<HTMLElement>(":scope > .slide-frame") ?? null;
}

export function resetSlide(section?: HTMLElement | null): void {
  const frame = frameOf(section);
  if (!frame) return;
  running.get(frame)?.forEach((a) => a.cancel());
  running.delete(frame);
}

export function playSlide(section?: HTMLElement | null): void {
  const frame = frameOf(section);
  if (!frame) return;

  const name = (frame.dataset.animation ?? "fade") as AnimationName;
  const content = frame.querySelector<HTMLElement>(":scope > [data-slide-content]");
  if (!content || name === "none") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const def = animations[name];
  if (!def) return;

  resetSlide(section);

  const stagger = name === "stagger";
  const targets = stagger ? (Array.from(content.children) as HTMLElement[]) : [content];

  running.set(
    frame,
    targets.map((el, i) =>
      el.animate(def.keyframes, { ...def.options, delay: stagger ? staggerDelay(i) : 0 }),
    ),
  );
}
