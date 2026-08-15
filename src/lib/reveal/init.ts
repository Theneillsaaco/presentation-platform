import Reveal from "reveal.js";
import type { RevealApi } from "reveal.js";
import { setCurrentSlide, resetPresentation } from "../stores/presentation";

interface SlideChangeEvent extends Event {
  indexh: number;
  indexv: number;
  previousSlide?: HTMLElement;
  currentSlide: HTMLElement;
}

let deck: RevealApi | null = null;

export interface InitRevealOptions {
  deckSlug: string;
  totalSlides: number;
}

export async function initReveal({ deckSlug, totalSlides }: InitRevealOptions): Promise<RevealApi> {
  resetPresentation(deckSlug, totalSlides);

  deck = new Reveal({
    hash: true,
    slideNumber: 'c/t',
    transition: 'slide',
    transitionSpeed: 'default',
    controls: true,
    progress: true,
    center: true,
    width: 1280,
    height: 720,
    margin: 0.04,
  });

  await deck.initialize();

  deck.on('slidechanged', event => {
    const e = event as SlideChangeEvent;
    const id = e.currentSlide?.dataset?.slideId ?? String(e.indexh);
    setCurrentSlide(id, e.indexh ?? 0);
  });

  return deck;
}

export function getDeck(): RevealApi | null {
  return deck;
}

export function destroyReveal() {
  deck?.destroy();
  deck = null;
}