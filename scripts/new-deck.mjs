#!/usr/bin/env node
// Uso: bun run new-deck -- mi-presentacion "Título de mi presentación"
import fs from "node:fs";
import path from "node:path";

const [, , slug, ...titleParts] = process.argv;

if (!slug) {
  console.error('Uso: bun run new-deck -- <slug> "Título"');
  process.exit(1);
}

const title = titleParts.join(" ") || slug;
const contentDir = path.resolve("src/content", slug);
const slidesDir = path.join(contentDir, "slides");
const publicDir = path.resolve("public/content", slug);

if (fs.existsSync(contentDir)) {
  console.error(`src/content/${slug} ya existe.`);
  process.exit(1);
}

fs.mkdirSync(slidesDir, { recursive: true });
fs.mkdirSync(publicDir, { recursive: true });

// slides.yaml: solo estructura. El contenido vive en slides/<id>.md|mdx.
fs.writeFileSync(
  path.join(contentDir, "slides.yaml"),
  `title: ${JSON.stringify(title)}
description: ""
# transition: slide     # none | fade | slide | convex | concave | zoom
# theme: dark           # fuerza claro u oscuro en todo el deck
# defaults:             # se aplica a toda slide que no lo defina
#   animation: fade

slides:
  - id: intro
    type: title         # title | section | content | split | quote | code | image | video | chart
    animation: fade     # fade | zoom | slide | stagger | reveal | none
`,
);

// Sin este archivo el build falla: cada id necesita su contenido.
fs.writeFileSync(
  path.join(slidesDir, "intro.md"),
  `---
notes: Notas de presentador (tecla S).
---

# ${title}

Subtítulo de la presentación.
`,
);

fs.writeFileSync(path.join(publicDir, ".gitkeep"), "");

console.log(`Deck creado:  src/content/${slug}/slides.yaml`);
console.log(`Contenido:    src/content/${slug}/slides/intro.md`);
console.log(`Assets en:    public/content/${slug}/`);
console.log(`Disponible en /${slug} con "bun run dev".`);
