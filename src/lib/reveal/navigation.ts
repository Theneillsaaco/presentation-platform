import { getDeck } from "./init";
import type { NotesPlugin } from "reveal.js/plugin/notes";

/**
 * The seam the AI flow described in planning hooks into later:
 *
 *   mic -> whisper -> transcript -> gemma -> classifier -> { section, confidence }
 *   classifier calls slideManager.goTo(section) when confidence clears
 *   AI_CONFIDENCE_THRESHOLD (see lib/stores/ai.ts).
 *
 * For now it's driven by keyboard / DeckHud, so the deck is fully usable
 * before any AI wiring exists.
 */
export const slideManager = {
  /** Jump to a slide by its `id` (the `id` field in slides.yaml). Works inside vertical stacks. */
  goTo(slideId: string): boolean {
    const deck = getDeck();
    if (!deck) return false;

    const target = deck.getSlides().find((el) => el.dataset.slideId === slideId);
    if (!target) return false;

    // Reveal indexes are (horizontal, vertical), NOT a flat list, so a flat
    // findIndex breaks as soon as the deck has a stack.
    const { h, v } = deck.getIndices(target);
    deck.slide(h, v);
    return true;
  },

  next(): void {
    getDeck()?.next();
  },

  prev(): void {
    getDeck()?.prev();
  },

  toggleOverview(): void {
    getDeck()?.toggleOverview();
  },

  openNotes(): void {
    (getDeck()?.getPlugin("notes") as NotesPlugin | undefined)?.open();
  },

  getCurrentSlideId(): string | null {
    return getDeck()?.getCurrentSlide()?.dataset.slideId ?? null;
  },
};
