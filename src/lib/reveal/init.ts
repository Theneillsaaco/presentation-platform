import Reveal from "reveal.js";
import type { RevealApi } from "reveal.js";
import RevealNotes from "reveal.js/plugin/notes";
import { patchPresentation, resetPresentation, setCurrentSlide } from "@/lib/stores/presentation";
import { playSlide, resetSlide } from "@/lib/animations/runtime";
import { toggleTheme } from "@/lib/stores/theme";

/**
 * reveal.js types `on()` via `HTMLElement['addEventListener']`, so the event
 * is a plain `Event` as far as TS knows. At runtime `slidechanged` carries
 * these fields (https://revealjs.com/events/), so we describe and cast.
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
  /** Deck-wide default transition (per-slide data-transition still wins). */
  transition?: "none" | "fade" | "slide" | "convex" | "concave" | "zoom";
  loop?: boolean;
}

/** Navigable slides in order: leaves only (stack wrappers excluded), hidden ones skipped. */
function navigableSlides(d: RevealApi): HTMLElement[] {
  return d
    .getSlides()
    .filter((el) => !el.querySelector(":scope > section") && el.dataset.visibility !== "hidden");
}

/**
 * Boots Reveal.js on the .reveal element rendered by [deck].astro and keeps
 * three things in sync on every slide change:
 *   1. the presentation store (drives DeckHud, chart animations, the future AI hook)
 *   2. per-slide theme override (`theme:` in slides.yaml)
 *   3. the slide's entrance animation (`animation:` in slides.yaml)
 */
export async function initReveal({
  deckSlug,
  transition = "slide",
  loop = false,
}: InitRevealOptions): Promise<RevealApi> {
  resetPresentation(deckSlug);

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
    autoSlide: 0, // per-slide `autoSlide` in slides.yaml overrides it
    plugins: [RevealNotes],
    keyboard: {
      84: () => toggleTheme(), // T
    },
  });

  await deck.initialize();

  const reveal = deck.getRevealElement();
  const viewport = deck.getViewportElement() ?? reveal;
  const deckTheme = reveal?.dataset.theme;

  const sync = (current: HTMLElement, previous?: HTMLElement) => {
    // Per-slide theme: rebind the MD3 variables on the viewport, so the
    // background (outside the 1280x720 slide) follows too.
    const wanted = current.dataset.slideTheme ?? deckTheme;
    if (viewport) {
      if (wanted) viewport.dataset.theme = wanted;
      else delete viewport.dataset.theme;
    }

    const slides = navigableSlides(deck!);
    setCurrentSlide(current.dataset.slideId ?? String(slides.indexOf(current)), Math.max(0, slides.indexOf(current)));
    patchPresentation({ totalSlides: slides.length });

    if (previous && previous !== current) resetSlide(previous);
    playSlide(current);
  };

  deck.on("slidechanged", (event) => {
    const e = event as SlideChangedEvent;
    sync(e.currentSlide, e.previousSlide);
  });

  deck.on("overviewshown", () => patchPresentation({ isOverview: true }));
  deck.on("overviewhidden", () => patchPresentation({ isOverview: false }));

  sync(deck.getCurrentSlide());

  return deck;
}

export function getDeck(): RevealApi | null {
  return deck;
}

export function destroyReveal() {
  deck?.destroy();
  deck = null;
}
