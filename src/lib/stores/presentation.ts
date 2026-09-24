import { writable } from "svelte/store";

export interface PresentationState {
  deckSlug: string | null;
  currentSlideId: string | null;
  /** 0-based position among navigable slides (stack children count). */
  currentIndex: number;
  totalSlides: number;
  isFullScreen: boolean;
  isOverview: boolean;
}

const initialState: PresentationState = {
  deckSlug: null,
  currentSlideId: null,
  currentIndex: 0,
  totalSlides: 0,
  isFullScreen: false,
  isOverview: false,
};

export const presentationState = writable<PresentationState>(initialState);

export function setCurrentSlide(id: string, index: number) {
  presentationState.update((s) => ({ ...s, currentSlideId: id, currentIndex: index }));
}

export function patchPresentation(patch: Partial<PresentationState>) {
  presentationState.update((s) => ({ ...s, ...patch }));
}

export function resetPresentation(deckSlug: string, totalSlides = 0) {
  presentationState.set({ ...initialState, deckSlug, totalSlides });
}
