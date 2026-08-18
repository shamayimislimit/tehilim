/**
 * Fidelity gate for src/data/tehilim.json against its reference edition,
 * Sefaria's "Miqra according to the Masorah" (Aleppo / Wikisource) — the edition
 * named in the file's own `source` field.
 *
 * Every verse must match the reference EXACTLY, code point for code point,
 * spacing included. The only transformations applied to the reference are the
 * removal of its HTML/layout markup:
 *   &thinsp; → U+2009 (the thin space the reference puts around the paseq ׀)
 *   &nbsp;   → U+00A0
 *   <b>/<small>/<big>/kq/implicit-maqaf spans → unwrapped (styling only)
 *   mam-spi-pe {פ} + <br>  → dropped (page layout, not text)
 *   mam-spi-invnun ׆       → kept inline at the head of the verse (Psalm 107)
 *
 * The reference is deliberately NOT NFC-normalised: its combining-mark order is
 * the Masoretic one and must be preserved byte for byte.
 *
 * Usage: node scripts/audit-text.mjs      (needs network access to sefaria.org)
 * Exit 0 = corpus identical to the reference; 1 = divergence; 2 = unreachable.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VERSION = 'Miqra according to the Masorah';

const data = JSON.parse(readFileSync(join(__dirname, '..', 'src', 'data', 'tehilim.json'), 'utf8'));

const res = await fetch(
  `https://www.sefaria.org/api/v3/texts/Psalms?version=hebrew|${encodeURIComponent(VERSION)}`
);
if (!res.ok) {
  console.error(`✗ Sefaria injoignable (HTTP ${res.status}) — audit non exécuté`);
  process.exit(2);
}
const ref = (await res.json()).versions[0].text;

/** Reference markup → plain verse text, in this corpus' conventions. */
export const cleanReference = (s) =>
  s
    .replace(/<span class="mam-spi-invnun">׆<\/span>&nbsp;/g, '׆\u00A0')
    .replace(/<span class="mam-spi-[^"]*">.*?<\/span>/g, '')
    .replace(/<br\s*\/?>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&thinsp;/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/^[\s  ]+|[\s  ]+$/g, '');

const cp = (s, k) => (s[k] ? 'U+' + s.codePointAt(k).toString(16).toUpperCase().padStart(4, '0') : '∅');

let verses = 0, exact = 0;
const damaged = [];
const diverging = [];
const missing = [];

for (const c of data.chapters) {
  const refChapter = ref[c.chapter - 1] ?? [];
  if (refChapter.length !== c.verses.length) {
    missing.push(`Ps ${c.chapter}: ${c.verses.length} versets ici / ${refChapter.length} dans la référence`);
  }
  c.verses.forEach((verse, i) => {
    verses++;
    const at = `${c.chapter}:${i + 1}`;
    if (verse.includes('�')) damaged.push(at);
    const expected = cleanReference(refChapter[i] ?? '');
    if (!expected) { missing.push(at); return; }
    if (verse === expected) { exact++; return; }
    let p = 0;
    while (p < verse.length && p < expected.length && verse[p] === expected[p]) p++;
    diverging.push(
      `${at}  ${cp(verse, p)} → ${cp(expected, p)}   …${verse.slice(Math.max(0, p - 8), p + 8)} | ${expected.slice(Math.max(0, p - 8), p + 8)}…`
    );
  });
}

console.log(`Référence : ${VERSION}`);
console.log(`Versets   : ${verses} — identiques au caractère près : ${exact}`);
console.log(`Caractères illisibles (U+FFFD) : ${damaged.length}${damaged.length ? ' → ' + damaged.join(', ') : ''}`);
console.log(`Versets divergents             : ${diverging.length}`);
diverging.slice(0, 50).forEach((d) => console.log('  ' + d));
if (diverging.length > 50) console.log(`  … et ${diverging.length - 50} autres`);
if (missing.length) console.log(`Versets sans équivalent        : ${missing.join(', ')}`);

process.exit(damaged.length || diverging.length || missing.length ? 1 : 0);
