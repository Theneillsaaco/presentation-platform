export type SlideType = "title" | "content" | "image" | "chart" | "video";

export interface BaseSlide {
  id: string;
  type: SlideType;
  title?: string;
  notes?: string;
  /** Optional animation applied to the slide's AnimatedCard wrapper */
  animation?: "fade" | "zoom" | "slide" | "stagger" | "reveal" | "none";
}

export interface TitleSlideData extends BaseSlide {
  type: "title";
  subtitle?: string;
  eyebrow?: string;
}

export interface ContentSlideData extends BaseSlide {
  type: "content";
  bullets: string[];
  body?: string;
}

export interface ImageSlideData extends BaseSlide {
  type: "image";
  src: string;
  alt?: string;
  caption?: string;
}

export interface ChartSlideData extends BaseSlide {
  type: "chart";
  chartType?: "bar" | "line" | "pie";
  labels?: string[];
  series?: { name: string; values: number[] }[];
}

export interface VideoSlideData extends BaseSlide {
  type: "video";
  src: string;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
}

export type Slide =
  | TitleSlideData
  | ContentSlideData
  | ImageSlideData
  | ChartSlideData
  | VideoSlideData;


export interface DeckMeta {
  /** Folder name under src/content, doubles as the URL slug */
  slug: string;
  title: string;
  slides: Slide[];
}
