/**
 * Build-time generator: src/data/prayers.phonetic.json
 *
 * French-Sephardi phonetic version of the Yehi Ratzon prayers, so phonetic mode
 * also covers the prayers (not just the psalms). Token-aware: @@BOOKMAP@@ /
 * @@RUBRIC_5BOOKS@@ / @@SEP@@ are preserved verbatim (PrayerBlock renders them);
 * [[X]] rubrics keep their wrapper with X transliterated; @@SHEMn@@ (the middot
 * Tetragrammaton) becomes "Adonaï". Source Hebrew is extracted from prayers.ts +
 * PrayerBlock.tsx so this stays in sync. Run: node scripts/gen-phonetic-prayers.mjs
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const { toPhonetic } = require('./phonetic/translit.cjs');

const __dirname = dirname(fileURLToPath(import.meta.url));
const prayersSrc = readFileSync(join(__dirname, '..', 'src', 'data', 'prayers.ts'), 'utf8');
const blockSrc = readFileSync(join(__dirname, '..', 'src', 'components', 'PrayerBlock.tsx'), 'utf8');

// The divine name in the prayers is the abbreviation יְיָ (two yods) — the engine
// reads it literally ("yeya"). Map it to the full Tetragrammaton so the schema's
// DIVINE_NAME rule renders "Adonaï" (handles prefixed forms too, e.g. מֵיְיָ).
const HEB_LETTER = /[א-ת]/;
// Map the abbreviated Name יְיָ → אֲדוֹנָי so it transliterates via normal letters
// (handles prefixed forms: מֵיְיָ→mé'adonay, לַיְיָ→la'adonay), then normalise the
// spelling to the canonical "Adonaï" (always capitalised, like a proper name).
const phonHeb = (s) => toPhonetic(s.replace(/יְיָ/g, 'אֲדוֹנָי')).replace(/adonay/gi, 'Adonaï');

// Instruction rubrics: unvocalised → transliteration is unreadable. In phonetic
// mode (for French speakers) render them in French. TO VERIFY WITH SARAH.
const RUBRIC_FR = {
  '(וּלְחוֹלֶה פב״פ)': '(et pour le malade untel)',
  '(פְּלוֹנִית)': '(nom de la ville)',
  '(יכוין בשם קרע שטן)': '(avoir en tête le Nom Kra-Satan)',
  '(אם אין עשרה שם יאמר י״ג מדות בטעמים כקורא בתורה)':
    '(s’il n’y a pas dix hommes, dire les 13 attributs avec les te’amim, comme la lecture de la Torah)',
};

// ── Token-aware phonetic transform of a prayer string ──
function phoneticize(text) {
  const parts = text.split(/(\n\n|@@[A-Z0-9_:]+@@|\[\[.+?\]\])/g);
  return parts
    .map((seg) => {
      if (seg === '') return '';
      if (seg === '\n\n') return '\n\n';
      if (/^@@SHEM[01]@@$/.test(seg)) return 'Adonaï';
      if (/^@@[A-Z0-9_:]+@@$/.test(seg)) return seg; // BOOKMAP / RUBRIC_5BOOKS / SEP
      const rub = seg.match(/^\[\[(.+?)\]\]$/);
      if (rub) return '[[' + (RUBRIC_FR[rub[1]] ?? phonHeb(rub[1])) + ']]';
      // Plain segment: transliterate if it has Hebrew, else preserve a separating
      // space (segments like " ׀ " between tokens must not collapse into "").
      if (!HEB_LETTER.test(seg)) return /\s/.test(seg) ? ' ' : '';
      const p = phonHeb(seg);
      // keep the segment's leading/trailing space so tokens stay word-separated
      return (/^\s/.test(seg) ? ' ' : '') + p + (/\s$/.test(seg) ? ' ' : '');
    })
    .join('')
    .replace(/ {2,}/g, ' ');
}

// ── Extract the atomic Hebrew pieces ──
const grab = (re, src = prayersSrc, g = 1) => {
  const m = src.match(re);
  if (!m) throw new Error('pattern not found: ' + re);
  return m[g];
};

const prayerBefore = grab(/export const prayerBefore: Prayer = \{[\s\S]*?text: `([\s\S]*?)`,/);
const sectionEndVerses = grab(/export const sectionEndVerses: Prayer = \{[\s\S]*?text: `([\s\S]*?)`,/);
const fiveBooksLine = grab(/const fiveBooksLine =\s*'([^']*)';/);
const closingIntroVerse = grab(/const closingIntroVerse =\s*'([^']*)';/);
const leadLine = grab(/'(יְהִי רָצוֹן מִלְּפָנֶיךָ[^']*)'/);
const closingBody = grab(/const closingBody = `([\s\S]*?)`;/);

// TORAH_BOOK_MAP ordinals + chumashim
const bookMapBlock = grab(/export const TORAH_BOOK_MAP[\s\S]*?\[([\s\S]*?)\];/);
const ordinals = [...bookMapBlock.matchAll(/ordinal: '([^']*)'/g)].map((m) => m[1]);
const chumashim = [...bookMapBlock.matchAll(/chumash: '([^']*)'/g)].map((m) => m[1]);

// The two @@BOOKMAP@@ connecting lines live in PrayerBlock.tsx (tv('…')).
const bookmapLead = grab(/tv\('(וִיהֵא חָשׁוּב[^']*)'\)/, blockSrc);
const bookmapConnect = grab(/tv\('(שֶׁבַּתְּהִלִּים[^']*)'\)/, blockSrc);

const out = {
  prayerBefore: phoneticize(prayerBefore),
  sectionEndVerses: phoneticize(sectionEndVerses),
  closingIntroVerse: phoneticize(closingIntroVerse),
  leadLine: phoneticize(leadLine),
  fiveBooksLine: phoneticize(fiveBooksLine),
  closingBody: phoneticize(closingBody),
  bookMap: {
    ordinals: ordinals.map((o) => toPhonetic(o)),
    chumashim: chumashim.map((c) => toPhonetic(c)),
    lead: toPhonetic(bookmapLead),
    connect: toPhonetic(bookmapConnect),
  },
};

writeFileSync(join(__dirname, '..', 'src', 'data', 'prayers.phonetic.json'), JSON.stringify(out, null, 2) + '\n');
console.log('✓ wrote src/data/prayers.phonetic.json');
console.log('\n-- samples --');
console.log('closingIntroVerse:', out.closingIntroVerse);
console.log('leadLine         :', out.leadLine);
console.log('bookMap.ordinals :', out.bookMap.ordinals.join(' · '));
console.log('bookMap.chumashim:', out.bookMap.chumashim.join(' · '));
console.log('closingBody[0..180]:', out.closingBody.slice(0, 180));
console.log('middot region     :', out.closingBody.slice(out.closingBody.indexOf('Adonaï') - 30, out.closingBody.indexOf('Adonaï') + 90));
