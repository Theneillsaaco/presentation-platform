#!/usr/bin/env node
/**
 * Generates src/styles/md3-theme.css from a single seed color using the
 * real Material Design 3 dynamic color algorithm — not hand-picked hex
 * values. Uses @material/material-color-utilities (Google's own
 * implementation of the HCT color space + tonal palette generation).
 *
 * Run manually with `npm run gen-theme`, or change SEED_COLOR and rerun.
 * Regenerating is required after changing the seed; nothing here reads
 * from user input at request-time (colors are fixed per build).
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

// Signal-cyan seed — telemetry/HUD feel for aerospace/robotics/technical decks.
const SEED_COLOR = "#00E5C7";
const CONTRAST_LEVEL = 0; // 0 = standard MD3 contrast. Range is -1 (min) to 1 (max).

// camelCase role name -> kebab-case CSS custom property name
function toKebab(name) {
  return name.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

function buildSchemeVars(scheme) {
  const roleNames = Object.keys(MaterialDynamicColors).filter(
    (k) => typeof MaterialDynamicColors[k]?.getArgb === "function"
  );

  const lines = [];
  for (const role of roleNames) {
    const argb = MaterialDynamicColors[role].getArgb(scheme);
    lines.push(`  --md-${toKebab(role)}: ${hexFromArgb(argb)};`);
  }
  return lines.join("\n");
}

const sourceHct = Hct.fromInt(argbFromHex(SEED_COLOR));
const lightScheme = new SchemeTonalSpot(sourceHct, false, CONTRAST_LEVEL);
const darkScheme = new SchemeTonalSpot(sourceHct, true, CONTRAST_LEVEL);

const css = `/**
 * GENERATED FILE — do not hand-edit.
 * Produced by scripts/generate-theme.mjs from seed ${SEED_COLOR}
 * using the real MD3 dynamic color algorithm (HCT + TonalSpot variant).
 * Regenerate with: npm run gen-theme
 */

:root,
:root[data-theme="dark"] {
${buildSchemeVars(darkScheme)}
}

:root[data-theme="light"] {
${buildSchemeVars(lightScheme)}
}
`;

const outPath = path.resolve("src/styles/md3-theme.css");
fs.writeFileSync(outPath, css);
console.log(`Wrote ${outPath} (seed ${SEED_COLOR}, light + dark, contrast ${CONTRAST_LEVEL})`);
