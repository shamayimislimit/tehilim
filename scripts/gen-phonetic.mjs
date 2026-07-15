/**
 * Build-time generator: src/data/tehilim.phonetic.json  (NEVER shipped engine).
 *
 * French-Sephardi phonetic transliteration of all 150 psalms, produced by the
 * canonical dagesh-authoritative engine (scripts/phonetic/translit.cjs — each
 * word transliterated in isolation across maqaf so the Masoretic pointing alone
 * decides begadkefat hard/soft).
 *
 * A dagesh-integrity gate runs BEFORE writing: every word whose first letter is
 * a begadkefat WITH dagesh must transliterate to the HARD consonant. On ANY
 * violation the script refuses to emit (sacred-text fidelity — see
 * feedback_sacred_text_fidelity). Output shape: { [chapter]: string[] }.
 *
 * Run: node scripts/gen-phonetic.mjs
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const { transliterate } = require('hebrew-transliteration');
const schema = require('./phonetic/schema-fr.cjs');
const { toPhonetic } = require('./phonetic/translit.cjs');

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = join(__dirname, '..', 'src', 'data', 'tehilim.json');
const outPath = join(__dirname, '..', 'src', 'data', 'tehilim.phonetic.json');

const data = JSON.parse(readFileSync(dataPath, 'utf8'));

// ── Dagesh-integrity gate (word-initial begadkefat + dagesh → hard consonant) ──
const MAQAF = '־';
const stripMacron = (s) => s.normalize('NFD').replace(/̄/g, '').normalize('NFC');
const BEGADKEFAT_HARD = { 'ב': 'b', 'ג': 'g', 'ד': 'd', 'כ': 'k', 'פ': 'p', 'ת': 't' };
let checked = 0;
const violations = [];
for (const c of data.chapters) {
  for (const v of c.verses) {
    for (const tok of v.split(/\s+/)) {
      for (const w of tok.split(MAQAF)) {
        // drop te'amim (U+0591..U+05AF) so first/second are letter + dagesh
        const clean = [...w].filter((ch) => ch.charCodeAt(0) < 0x0591 || ch.charCodeAt(0) > 0x05af);
        if (clean.length < 2) continue;
        if (BEGADKEFAT_HARD[clean[0]] && clean[1] === 'ּ') {
          checked++;
          const out = stripMacron(transliterate(w, schema)).trim().toLowerCase();
          if (!out.startsWith(BEGADKEFAT_HARD[clean[0]])) {
            violations.push(`${w} → "${out}" (expected initial "${BEGADKEFAT_HARD[clean[0]]}")`);
          }
        }
      }
    }
  }
}

console.log(`Dagesh-integrity gate: checked ${checked} word-initial begadkefat+dagesh, ${violations.length} violation(s).`);
if (violations.length) {
  console.error('\n✗ REFUSING TO EMIT — dagesh violations:');
  violations.slice(0, 30).forEach((x) => console.error('  ', x));
  process.exit(1);
}

// ── Generate { [chapter]: string[] } ──
const out = {};
let verseCount = 0;
for (const c of data.chapters) {
  out[c.chapter] = c.verses.map((v) => {
    verseCount++;
    return toPhonetic(v);
  });
}

writeFileSync(outPath, JSON.stringify(out) + '\n');
console.log(`✓ Wrote ${outPath}`);
console.log(`  chapters: ${Object.keys(out).length}, verses: ${verseCount}`);
console.log(`  sample Ps 1:1 → ${out[1][0]}`);
console.log(`  sample Ps 23:1 → ${out[23][0]}`);
console.log(`  sample Ps 150:6 → ${out[150][out[150].length - 1]}`);
