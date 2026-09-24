import fs from "node:fs";
import path from "node:path";
import { load as parseYaml } from "js-yaml";
import type { DeckStructure } from "./types";

const CONTENT_DIR = path.resolve(process.cwd(), "src/content");

/**
 * Lists deck slugs = folder names under src/content that contain a
 * slides.yaml file. Adding a new presentation is: make a folder, drop a
 * slides.yaml (structure) + slides/<id>.md|mdx per slide (content) in it.
 */
export function listDeckSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((slug) =>
      fs.existsSync(path.join(CONTENT_DIR, slug, "slides.yaml"))
    );
}

/** Parses one deck's slides.yaml — structure + presentation config. */
export function loadDeckStructure(slug: string): DeckStructure {
  const filePath = path.join(CONTENT_DIR, slug, "slides.yaml");
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = parseYaml(raw) as {
    title: string;
    theme?: DeckStructure["theme"];
    transition?: DeckStructure["transition"];
    loop?: boolean;
    slides: DeckStructure["slides"];
  };

  if (!parsed?.slides?.length) {
    throw new Error(`Deck "${slug}" has no slides in slides.yaml`);
  }

  return {
    slug,
    title: parsed.title ?? slug,
    theme: parsed.theme,
    transition: parsed.transition,
    loop: parsed.loop,
    slides: parsed.slides,
  };
}

/** Loads every deck's structure found under src/content. */
export function loadAllDeckStructures(): DeckStructure[] {
  return listDeckSlugs().map(loadDeckStructure);
}

/** Optional speaker notes markdown for a deck, if notes.md exists. */
export function loadDeckNotes(slug: string): string | null {
  const notesPath = path.join(CONTENT_DIR, slug, "notes.md");
  return fs.existsSync(notesPath) ? fs.readFileSync(notesPath, "utf-8") : null;
}

/** The content-collection entry id for a given deck slug + slide id. */
export function slideContentId(slug: string, slideId: string): string {
  return `${slug}/slides/${slideId}`;
}

export { assetUrl } from "./assets";
