import { writable } from "svelte/store";

export interface PresentationState {
  deckSlug: string | null; 
  currentSlideId: string | null;
  currentIndex: number;
  totalSlides: number;
  isFullScreen: boolean;
}

const initialState: PresentationState = {
  deckSlug: null,
  currentSlideId: null,
  currentIndex: 0,
  totalSlides: 0,
  isFullScreen: false,
};

export const presentationState = writable<PresentationState>(initialState);

export function setCurrentSlide(id: string, index: number) {
  presentationState.update(s => ({ ...s, currentSlideId: id, currentIndex: index }));
}

export function resetPresentation(deckSlug: string, totalSlides: number) {
  presentationState.set({ ...initialState, deckSlug, totalSlides });
}