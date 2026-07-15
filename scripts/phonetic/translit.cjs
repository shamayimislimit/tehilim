// Canonical French-Sephardi phonetic transliteration for the Tehilim app.
// Deterministic & dagesh-authoritative: each word is transliterated in ISOLATION
// (split on whitespace + maqaf) so the Masoretic pointing alone decides
// begadkefat hard/soft and vowels — the engine's cross-maqaf spirantization
// heuristic (which wrongly turned dageshed פּ/בּ/כּ into f/v/kh) never fires.
const { transliterate } = require('hebrew-transliteration');
const schema = require('./schema-fr.cjs');

const MAQAF = '־';
const HAS_LETTER = /[א-ת]/;
const AYIN = schema.AYIN_MARK; // U+0001
const ALEF = schema.ALEF_MARK; // U+0002
const VOWELS = 'aeiouyàâäéèêëïîôöùûü';

// Remove the engine's long-vowel macron (U+0304) without touching é/è (U+0301/U+0300).
const stripMacron = (s) => s.normalize('NFD').replace(/̄/g, '').normalize('NFC');
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

// Point 2 — ‛ayin/aleph: keep the sentinel as an apostrophe only between two
// vowels (prevents hiatus collapse: ro'i, ha'ich, ya'akov), drop it otherwise.
const V = `[${VOWELS}]`;
const resolveGutturals = (s) =>
  s
    .replace(new RegExp(`(?<=${V})[${AYIN}${ALEF}](?=${V})`, 'gi'), "'")
    .replace(new RegExp(`[${AYIN}${ALEF}]`, 'g'), '');

// Point 1 — hard g: Hebrew gimel is always [g], but French "g" before e/i/y is
// [ʒ] → insert "u" (gué/gui) so it reads hard. Before a/o/ou the g is already hard.
const hardG = (s) => s.replace(/([Gg])(?=[eiéèêyEIÉÈÊY])/g, (m) => m + 'u');

/** Transliterate one raw Hebrew word (no maqaf) → phonetic, sentinels intact. */
const rawWord = (w) => (HAS_LETTER.test(w) ? stripMacron(transliterate(w, schema)).trim() : '');

/** Transliterate one verse → French-Sephardi phonetic string. */
function toPhonetic(verse) {
  let out = verse
    .split(/\s+/)
    .filter(Boolean)
    .map((tok) => tok.split(MAQAF).map(rawWord).filter(Boolean).join('-'))
    .filter(Boolean)
    .join(' ');
  out = resolveGutturals(out);
  out = hardG(out);
  out = out.replace(/\s+/g, ' ').trim();
  return cap(out);
}

module.exports = { toPhonetic };
