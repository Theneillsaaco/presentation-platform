import Reveal from "reveal.js";
import type { RevealApi } from "reveal.js";
import { setCurrentSlide, resetPresentation } from "@/lib/stores/presentation";

/**
 * reveal.js's own .d.ts types `on()` via `HTMLElement['addEventListener']`,
 * so the event object it hands back is a plain `Event` as far as TS knows.
 * At runtime `slidechanged` actually carries these fields — see
 * https://revealjs.com/events/ — so we describe them ourselves and cast.
 */
interface SlideChangedEvent extends Event {
  indexh: number;
  indexv: number;
  previousSlide?: HTMLElement;
  currentSlide: HTMLElement;
}

let deck: RevealApi | null = null;

export interface InitRevealOptions {
  deckSlug: string;
  totalSlides: number;
  /** Deck-wide default transition (per-slide data-transition on <section> still wins). */
  transition?: "none" | "fade" | "slide" | "convex" | "concave" | "zoom";
  loop?: boolean;
}

/**
 * Boots Reveal.js against the .reveal element already rendered by
 * PresentationLayout.astro, and wires slidechanged events into the
 * presentation store (which slideManager.goTo() below also drives).
 */
export async function initReveal({
  deckSlug,
  totalSlides,
  transition = "slide",
  loop = false,
}: InitRevealOptions): Promise<RevealApi> {
  resetPresentation(deckSlug, totalSlides);

  deck = new Reveal({
    hash: true,
    slideNumber: "c/t",
    transition,
    transitionSpeed: "default",
    controls: true,
    progress: true,
    center: false,
    width: 1280,
    height: 720,
    margin: 0.04,
    loop,
    // autoSlide is set globally to 0 (off) — per-slide data-autoslide on
    // <section> (see slides.yaml `autoSlide`) overrides it individually.
    autoSlide: 0,
  });

  await deck.initialize();

  deck.on("slidechanged", (event) => {
    const e = event as SlideChangedEvent;
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
