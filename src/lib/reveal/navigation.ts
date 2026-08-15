import { getDeck } from "./init";

export const slideManager = {
  goTo(slideId: string): boolean {
    const deck = getDeck();
    if (!deck) return false;

    const target = deck
      .getSlides()
      .findIndex(el => el.dataset.slideId === slideId);

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