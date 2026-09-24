import fs from "node:fs";
import path from "node:path";
import { load as parseYaml } from "js-yaml";
import {
  SLIDE_ANIMATIONS,
  SLIDE_TYPES,
  TRANSITIONS,
  type DeckStructure,
  type SlideStructure,
} from "./types";

const CONTENT_DIR = path.resolve(process.cwd(), "src/content");

/**
 * Deck slugs = folders under src/content that contain a slides.yaml.
 * New presentation: `bun run new-deck -- <slug> "Titulo"`.
 */
export function listDeckSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((slug) => fs.existsSync(path.join(CONTENT_DIR, slug, "slides.yaml")))
    .sort();
}

const SLIDE_KEYS = new Set([
  "id", "type", "animation", "theme", "background", "transition",
  "autoSlide", "hidden", "class", "stack",
]);
const DECK_KEYS = new Set([
  "title", "description", "theme", "transition", "loop", "defaults", "slides",
]);

/**
 * Validates + normalises slides.yaml. Errors name the deck, the slide and
 * the accepted values, so a typo in YAML fails the build with a useful
 * message instead of a blank slide at runtime.
 */
function normalizeSlides(
  slug: string,
  slides: unknown,
  defaults: NonNullable<DeckStructure["defaults"]>,
  seen: Set<string>,
  where = "slides",
): SlideStructure[] {
  if (!Array.isArray(slides) || slides.length === 0) {
    throw new Error(`[${slug}] "${where}" must be a non-empty list`);
  }

  return slides.map((raw, i) => {
    const s = raw as Record<string, any>;
    const at = `${where}[${i}]${s?.id ? ` (id: ${s.id})` : ""}`;

    if (!s || typeof s !== "object") throw new Error(`[${slug}] ${at} must be an object`);
    if (typeof s.id !== "string" || !s.id) throw new Error(`[${slug}] ${at} is missing "id"`);
    if (seen.has(s.id)) throw new Error(`[${slug}] duplicated slide id "${s.id}"`);
    seen.add(s.id);

    for (const key of Object.keys(s)) {
      if (!SLIDE_KEYS.has(key)) {
        throw new Error(`[${slug}] ${at}: unknown field "${key}". Valid: ${[...SLIDE_KEYS].join(", ")}`);
      }
    }

    if (s.stack) {
      return { id: s.id, hidden: s.hidden, stack: normalizeSlides(slug, s.stack, defaults, seen, `${at}.stack`) };
    }

    const type = s.type ?? defaults.type ?? "content";
    const animation = s.animation ?? defaults.animation ?? "fade";
    const transition = s.transition ?? defaults.transition;

    if (!SLIDE_TYPES.includes(type)) throw new Error(`[${slug}] ${at}: type "${type}" invalid. Valid: ${SLIDE_TYPES.join(", ")}`);
    if (!SLIDE_ANIMATIONS.includes(animation)) throw new Error(`[${slug}] ${at}: animation "${animation}" invalid. Valid: ${SLIDE_ANIMATIONS.join(", ")}`);
    if (transition && !TRANSITIONS.includes(transition)) throw new Error(`[${slug}] ${at}: transition "${transition}" invalid. Valid: ${TRANSITIONS.join(", ")}`);
    if (s.theme && s.theme !== "light" && s.theme !== "dark") throw new Error(`[${slug}] ${at}: theme must be "light" or "dark"`);

    return { ...s, id: s.id, type, animation, transition } as SlideStructure;
  });
}

/** Parses one deck's slides.yaml — structure + presentation config. */
export function loadDeckStructure(slug: string): DeckStructure {
  const filePath = path.join(CONTENT_DIR, slug, "slides.yaml");
  const parsed = parseYaml(fs.readFileSync(filePath, "utf-8")) as Record<string, any>;

  if (!parsed || typeof parsed !== "object") throw new Error(`[${slug}] slides.yaml is empty`);
  for (const key of Object.keys(parsed)) {
    if (!DECK_KEYS.has(key)) {
      throw new Error(`[${slug}] unknown deck field "${key}". Valid: ${[...DECK_KEYS].join(", ")}`);
    }
  }
  if (parsed.transition && !TRANSITIONS.includes(parsed.transition)) {
    throw new Error(`[${slug}] transition "${parsed.transition}" invalid. Valid: ${TRANSITIONS.join(", ")}`);
  }

  const defaults = parsed.defaults ?? {};

  return {
    slug,
    title: parsed.title ?? slug,
    description: parsed.description,
    theme: parsed.theme,
    transition: parsed.transition,
    loop: parsed.loop,
    defaults,
    slides: normalizeSlides(slug, parsed.slides, defaults, new Set()),
  };
}

export function loadAllDeckStructures(): DeckStructure[] {
  return listDeckSlugs().map(loadDeckStructure);
}

/** Number of navigable slides (stack children count individually, stack wrappers don't). */
export function countSlides(slides: SlideStructure[]): number {
  return slides.reduce((n, s) => n + (s.stack ? countSlides(s.stack) : 1), 0);
}

/** Content-collection entry id for a given deck slug + slide id. */
export function slideContentId(slug: string, slideId: string): string {
  return `${slug}/slides/${slideId}`;
}

export { assetUrl } from "./assets";
