/**
 * Fidelity audit of src/data/tehilim.json against its reference edition,
 * Sefaria's "Miqra according to the Masorah" (Aleppo / Wikisource) — the very
 * edition named in the file's `source` field.
 *
 * Reports, per verse:
 *   - characters no font can render (U+FFFD), i.e. encoding damage;
 *   - any divergence in letters / nikkud / te'amim from the reference.
 *
 * Purely typographic differences are neutralised before comparing: the reference
 * carries HTML markup, {פ}/{ס} section marks, an inverted-nun paratext span, and
 * spaces around the paseq (this corpus glues it to the preceding word).
 *
 * Usage: node scripts/audit-text.mjs        (needs network access to sefaria.org)
 * Exit code 1 if anything diverges — usable as a gate.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VERSION = 'Miqra according to the Masorah';

const data = JSON.parse(readFileSync(join(__dirname, '..', 'src', 'data', 'tehilim.json'), 'utf8'));

const url = `https://www.sefaria.org/api/v3/texts/Psalms?version=hebrew|${encodeURIComponent(VERSION)}`;
const res = await fetch(url);
if (!res.ok) {
  console.error(`✗ Sefaria unreachable (HTTP ${res.status}) — audit skipped`);
  process.exit(2);
}
const ref = (await res.json()).versions[0].text;

/** Reference markup → plain verse text. */
const cleanRef = (s) =>
  s
    .replace(/<span class="mam-spi-[^"]*">.*?<\/span>/g, '') // {פ}/{ס}/inverted-nun paratext
    .replace(/<br>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&thinsp;|&nbsp;/g, ' ')
    .replace(/\{[פסש]\}/g, '');

/** Compare on content only: spacing and invisible joiners carry no meaning here. */
const cmp = (s) => s.normalize('NFC').replace(/͏/g, '').replace(/\s+/g, '');

/**
 * Psalm 107 carries the inverted nun (׆) inline at the head of the verse, where
 * the reference keeps it as a separate paratext span. Kept on purpose — it is a
 * Masoretic mark, not damage — so it must not count as a divergence.
 */
const INVERTED_NUN = /^׆\s*/;

const damaged = [];
const diverging = [];
const invertedNun = [];

for (const c of data.chapters) {
  const refChapter = ref[c.chapter - 1] ?? [];
  c.verses.forEach((verse, i) => {
    const at = `${c.chapter}:${i + 1}`;
    if (verse.includes('�')) damaged.push(at);
    if (INVERTED_NUN.test(verse)) invertedNun.push(at);
    const a = cmp(verse.replace(INVERTED_NUN, ''));
    const b = cmp(cleanRef(refChapter[i] ?? ''));
    if (!b) return; // reference missing this verse — nothing to compare against
    if (a !== b) {
      let p = 0;
      while (p < a.length && p < b.length && a[p] === b[p]) p++;
      const cp = (s, k) => (s[k] ? 'U+' + s.codePointAt(k).toString(16).toUpperCase().padStart(4, '0') : '∅');
      diverging.push(`${at}  ${cp(a, p)} → ${cp(b, p)}   …${a.slice(Math.max(0, p - 8), p + 8)} | ${b.slice(Math.max(0, p - 8), p + 8)}…`);
    }
  });
}

console.log(`Référence : ${VERSION}`);
console.log(`Versets   : ${data.chapters.reduce((n, c) => n + c.verses.length, 0)}`);
console.log(`Caractères illisibles (U+FFFD) : ${damaged.length}${damaged.length ? ' → ' + damaged.join(', ') : ''}`);
console.log(`Versets divergents             : ${diverging.length}`);
diverging.forEach((d) => console.log('  ' + d));
console.log(`Nun inversé (׆) conservé       : ${invertedNun.join(', ') || '—'}`);

process.exit(damaged.length || diverging.length ? 1 : 0);
