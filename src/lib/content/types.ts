/**
 * Structure + configuration types.
 *
 * Split of responsibilities:
 *   - slides.yaml   -> ordering, layout frame, animation, per-slide presentation config
 *   - slides/<id>.md|mdx -> the actual content (text, images, video, HTML, components)
 *                           + optional frontmatter (see SlideFrontmatter)
 */
export type SlideType =
  | "title"    // portada: h1 + subtitulo
  | "section"  // divisor de seccion, texto grande
  | "content"  // titulo + bullets/texto
  | "split"    // titulo + 2 bloques lado a lado (texto | codigo/imagen/chart)
  | "quote"    // cita grande + atribucion
  | "code"     // bloque de codigo a pantalla casi completa
  | "image"
  | "video"
  | "chart";

export const SLIDE_TYPES: readonly SlideType[] = [
  "title", "section", "content", "split", "quote", "code", "image", "video", "chart",
];

export type SlideAnimation = "fade" | "zoom" | "slide" | "stagger" | "reveal" | "none";
export const SLIDE_ANIMATIONS: readonly SlideAnimation[] = [
  "fade", "zoom", "slide", "stagger", "reveal", "none",
];

export type Transition = "none" | "fade" | "slide" | "convex" | "concave" | "zoom";
export const TRANSITIONS: readonly Transition[] = [
  "none", "fade", "slide", "convex", "concave", "zoom",
];

export type ThemeOverride = "light" | "dark";

/** Reveal.js background data-attributes for one slide. All optional. */
export interface SlideBackground {
  /** Any valid CSS color (MD3 vars included: "var(--md-tertiary-container)"). */
  color?: string;
  /** Any valid CSS gradient, e.g. "linear-gradient(135deg, var(--md-primary-container), var(--md-surface))". */
  gradient?: string;
  /** Path relative to public/content/<slug>/, or an absolute/external URL. */
  image?: string;
  /** Same resolution rules as `image`. */
  video?: string;
  /** data-background-size: "cover" | "contain" | a custom CSS size string. */
  size?: string;
  /** 0-1. Useful to dim a background image/video behind text. */
  opacity?: number;
  /** Loop background video. */
  loop?: boolean;
}

export interface SlideStructure {
  /** Unique within the deck. Must match slides/<id>.md|mdx, UNLESS `stack` is set. */
  id: string;
  /** Layout frame. Omit only for a pure vertical-stack wrapper (has `stack`). Falls back to deck `defaults.type`, then "content". */
  type?: SlideType;
  /** Entrance animation. Falls back to deck `defaults.animation`, then "fade". */
  animation?: SlideAnimation;
  /** Overrides the deck/global light-dark theme while this slide is showing. */
  theme?: ThemeOverride;
  background?: SlideBackground;
  /** Reveal.js per-slide transition override. Falls back to deck `defaults.transition`. */
  transition?: Transition;
  /** Auto-advance after N milliseconds. 0 disables auto-advance on this slide. */
  autoSlide?: number;
  /** Hide from normal navigation (backup slides). Still reachable by #/id. */
  hidden?: boolean;
  /** Extra CSS classes on the <section>, e.g. "is-dense". */
  class?: string;
  /**
   * Vertical sub-slides (navigated with up/down). This entry becomes a pure
   * grouping node: no content file, and its own type/animation are ignored.
   */
  stack?: SlideStructure[];
}

/** Per-deck defaults applied to every slide that doesn't set the field itself. */
export interface DeckDefaults {
  type?: SlideType;
  animation?: SlideAnimation;
  transition?: Transition;
}

export interface DeckStructure {
  /** Folder name under src/content, doubles as the URL slug */
  slug: string;
  title: string;
  /** One-liner shown on the index page. */
  description?: string;
  /** Deck-wide theme override. */
  theme?: ThemeOverride;
  /** Reveal.js deck-wide transition (defaults to "slide"). */
  transition?: Transition;
  /** Loop back to the first slide after the last one. */
  loop?: boolean;
  defaults?: DeckDefaults;
  slides: SlideStructure[];
}

/** Frontmatter accepted at the top of slides/<id>.md|mdx (see content.config.ts). */
export interface SlideFrontmatter {
  /** Speaker notes. Open the speaker view with the "S" key. Plain text. */
  notes?: string;
}
