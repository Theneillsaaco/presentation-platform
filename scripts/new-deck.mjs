#!/usr/bin/env node
// Usage: npm run new-deck -- mi-presentacion "Título de mi presentación"
import fs from "node:fs";
import path from "node:path";

const [, , slug, ...titleParts] = process.argv;

if (!slug) {
  console.error('Uso: bun run new-deck -- <slug> "Titulo"')
  process.exit(1)
}

const title = titleParts.join(" ") || slug;
const contentDir = path.resolve("src/content", slug);
const publicDir = path.resolve("public/content", slug);

if (fs.existsSync(contentDir)) {
  console.error(`src/content/${slug} ya existe.`);
  process.exit(1);
}

fs.mkdirSync(contentDir, { recursive: true });
fs.mkdirSync(path.join(contentDir, "assets"), { recursive: true });
fs.mkdirSync(publicDir, { recursive: true });

fs.writeFileSync(
  path.join(contentDir, "slides.yaml"),
  `title: ${title}\n\nslides:\n  - id: intro\n    type: title\n    title: ${title}\n    subtitle: ""\n`
);
fs.writeFileSync(path.join(contentDir, "notes.md"), `# Notas del presentador — ${title}\n`);
fs.writeFileSync(path.join(publicDir, ".gitkeep"), "");

console.log(`Deck creado: src/content/${slug}/slides.yaml`);
console.log(`Assets en:   public/content/${slug}/`);
console.log(`Disponible en /${slug} al correr "npm run dev".`);