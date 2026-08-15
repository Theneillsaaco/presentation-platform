import fs from "node:fs";
import path from "node:path";
import { load as parseYaml } from "js-yaml";
import type { DeckMeta } from "./types";

const CONTENT_DIR = path.resolve(process.cwd(), "src/content");

export function listDeckSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .filter(slug => 
      fs.existsSync(path.join(CONTENT_DIR, slug, "slides.yaml"))
    );
}

export function loadDeck(slug: string): DeckMeta {
  const filePath = path.join(CONTENT_DIR, slug, "slides.yaml");
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = parseYaml(raw) as {
    title: string;
    slides: DeckMeta["slides"];
  };

  if (!parsed?.slides?.length)
    throw new Error(`Deck "${slug}" has no slides in slides.yaml`);

  return {
    slug,
    title: parsed.title ?? slug,
    slides: parsed.slides,
  };
}

export function loadAllDecks(): DeckMeta[] {
  return listDeckSlugs().map(loadDeck);
}

export function loadDeckNotes(slug: string): string | null {
  const notesPath = path.join(CONTENT_DIR, slug, "notes.md");
  return fs.existsSync(notesPath) ? fs.readFileSync(notesPath, "utf-8") : null;
}

export { assetUrl } from "./assets";
