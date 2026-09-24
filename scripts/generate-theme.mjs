#!/usr/bin/env node
/**
 * Generates src/styles/md3-theme.css from a single seed color using the
 * real Material Design 3 dynamic color algorithm (HCT + TonalSpot).
 *
 * Run with `bun run gen-theme` after changing SEED_COLOR.
 *
 * Selectors are attribute-only ([data-theme=...]) rather than :root[...],
 * so ANY element can rebind the palette. That is what makes per-slide
 * `theme: light|dark` in slides.yaml and deck-level `theme:` work.
 */
import fs from "node:fs";
import path from "node:path";
import {
  Hct,
  argbFromHex,
  hexFromArgb,
  SchemeTonalSpot,
  MaterialDynamicColors,
} from "@material/material-color-utilities";

// Signal-cyan seed: telemetry/HUD feel for aerospace/robotics/technical decks.
const SEED_COLOR = "#00E5C7";
const CONTRAST_LEVEL = 0; // -1 (min) .. 1 (max), 0 = standard MD3

const toKebab = (name) => name.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

function buildSchemeVars(scheme) {
  return Object.keys(MaterialDynamicColors)
    .filter((k) => typeof MaterialDynamicColors[k]?.getArgb === "function")
    .map((role) => `  --md-${toKebab(role)}: ${hexFromArgb(MaterialDynamicColors[role].getArgb(scheme))};`)
    .join("\n");
}

const sourceHct = Hct.fromInt(argbFromHex(SEED_COLOR));
const light = new SchemeTonalSpot(sourceHct, false, CONTRAST_LEVEL);
const dark = new SchemeTonalSpot(sourceHct, true, CONTRAST_LEVEL);

const css = `/**
 * GENERATED FILE — do not hand-edit.
 * Produced by scripts/generate-theme.mjs from seed ${SEED_COLOR}
 * using the real MD3 dynamic color algorithm (HCT + TonalSpot variant).
 * Regenerate with: bun run gen-theme
 *
 * [data-theme] (not :root[data-theme]) so any element can rebind the palette.
 * Dark is also the default with no attribute at all. Light comes second so it
 * wins on equal specificity when both a parent and the element are set.
 */

:root,
[data-theme="dark"] {
${buildSchemeVars(dark)}
}

[data-theme="light"] {
${buildSchemeVars(light)}
}
`;

const outPath = path.resolve("src/styles/md3-theme.css");
fs.writeFileSync(outPath, css);
console.log(`Wrote ${outPath} (seed ${SEED_COLOR}, light + dark, contrast ${CONTRAST_LEVEL})`);
