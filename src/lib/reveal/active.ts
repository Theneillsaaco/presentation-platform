import { presentationState } from "@/lib/stores/presentation";

/**
 * Svelte action: tells a component when the slide that contains it is the
 * current one, so charts/diagrams can animate on arrival instead of at page load.
 *
 *   <div use:slideActive={(v) => (active = v)}>
 *
 * Outside a slide (index page, previews) it reports `true` immediately.
 */
export function slideActive(node: HTMLElement, callback: (active: boolean) => void) {
  const id = node.closest<HTMLElement>("section[data-slide-id]")?.dataset.slideId;
  const unsubscribe = presentationState.subscribe((s) => callback(!id || s.currentSlideId === id));
  return { destroy: unsubscribe };
}
