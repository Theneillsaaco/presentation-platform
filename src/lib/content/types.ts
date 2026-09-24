/**
 * Structural + configuration types. Text, images, video, raw HTML, and
 * embedded Svelte/Astro components live in src/content/<slug>/slides/<id>.md(x)
 * — see src/content.config.ts. slides.yaml (parsed into these types) only
 * decides ordering, layout "frame", animation, and slide/deck-level
 * presentation config (theme, background, transition, auto-advance).
 */
export type SlideType = "title" | "content" | "image" | "chart" | "video";

export type ThemeOverride = "light" | "dark";

/** Reveal.js background data-attributes for one slide. All optional. */
export interface SlideBackground {
  /** Any valid CSS color. */
  color?: string;
  /** Path relative to public/content/<slug>/, or an absolute/external URL. */
  image?: string;
  /** Same resolution rules as `image`. */
  video?: string;
  /** data-background-size: "cover" | "contain" | a custom CSS size string. */
  size?: string;
  /** 0–1. Useful to dim a background image/video behind text. */
  opacity?: number;
  /** Loop background video. */
  loop?: boolean;
}

export interface SlideStructure {
  /** Unique within the deck. Must match a content file: slides/<id>.md or .mdx
   *  — UNLESS `stack` is set, in which case this id is just a grouping id
   *  and has no content file of its own (see `stack`). */
  id: string;
  /** Omit only when this entry is a pure vertical-stack wrapper (has `stack`). */
  type?: SlideType;
  /** Animation applied to the AnimatedCard wrapping this slide's content. */
  animation?: "fade" | "zoom" | "slide" | "stagger" | "reveal" | "none";
  /** Overrides the deck/global light-dark theme for just this slide. */
  theme?: ThemeOverride;
  background?: SlideBackground;
  /** Reveal.js per-slide transition override (data-transition). */
  transition?: "none" | "fade" | "slide" | "convex" | "concave" | "zoom";
  /** Auto-advance after N milliseconds. 0 disables auto-advance on this slide. */
  autoSlide?: number;
  /** Hide from normal navigation (data-visibility="hidden") — e.g. backup slides. */
  hidden?: boolean;
  /**
   * Vertical sub-slides navigated with ↑/↓ instead of ←/→ — Reveal.js's
   * native mechanism for "same topic, different content" (nested
   * <section> elements). When set, this entry becomes a pure grouping
   * node: it has no content file of its own, `type`/`animation`/etc. on
   * THIS entry are ignored, and every item in `stack` is a normal
   * SlideStructure (its own type, content file, animation...).
   */
  stack?: SlideStructure[];
}

export interface DeckStructure {
  /** Folder name under src/content, doubles as the URL slug */
  slug: string;
  title: string;
  /** Deck-wide theme override — applied on .reveal, wins over the global toggle for this deck. */
  theme?: ThemeOverride;
  /** Reveal.js deck-wide transition (defaults to "slide" if unset). */
  transition?: "none" | "fade" | "slide" | "convex" | "concave" | "zoom";
  /** Loop back to the first slide after the last one. */
  loop?: boolean;
  slides: SlideStructure[];
}
