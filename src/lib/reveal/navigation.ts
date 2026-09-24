import { getDeck } from "./init";

/**
 * This is the seam the AI flow described in planning hooks into later:
 *
 *   mic -> whisper -> transcript -> gemma -> classifier -> { section, confidence }
 *   classifier calls slideManager.goTo(section) when confidence clears
 *   AI_CONFIDENCE_THRESHOLD (see lib/stores/ai.ts).
 *
 * For now it's driven manually / by UI controls, so the deck is fully
 * usable before any AI wiring exists.
 */
export const slideManager = {
  /** Jump to a slide by its `id` (the `id` field in slides.yaml). */
  goTo(slideId: string): boolean {
    const deck = getDeck();
    if (!deck) return false;

    const target = deck
      .getSlides()
      .findIndex((el) => el.dataset.slideId === slideId);

    if (target === -1) return false;

    deck.slide(target);
    return true;
  },

  next(): void {
    getDeck()?.next();
  },

  prev(): void {
    getDeck()?.prev();
  },

  goToIndex(index: number): void {
    getDeck()?.slide(index);
  },

  getCurrentIndex(): number {
    return getDeck()?.getIndices().h ?? 0;
  },
};
