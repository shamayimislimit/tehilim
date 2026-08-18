/**
 * Hebrew text scrubbing utilities.
 * Unicode ranges:
 *   U+05BD–U+05BF      meteg, paseq, etc.
 *   U+0591–U+05AF      cantillation marks (טעמים)
 *   U+05B0–U+05BD      nikkud / vowel points
 *   U+05C1–U+05C5      shin/sin dots, varika
 *   U+05C7             qamatz qatan
 */
const CANTILLATION = /[֑-ֽֿ֯׀׃׆]/g;
const NIKKUD = /[ְ-ׇּׁׂׅׄ]/g;

/**
 * The source frames the paseq (׀) with thin spaces and the inverted nun (׆) with
 * a no-break space. Dropping those marks would leave the spaces stacked, so runs
 * of whitespace collapse back to a single one.
 */
const collapseSpaces = (s: string) => s.replace(/\s{2,}/g, ' ').trim();

export const stripCantillation = (s: string) => collapseSpaces(s.replace(CANTILLATION, ''));
export const stripNikkud = (s: string) => s.replace(NIKKUD, '');

export const transformVerse = (
  text: string,
  showCantillation: boolean,
  showNikkud: boolean
): string => {
  let out = text;
  if (!showCantillation) out = stripCantillation(out);
  if (!showNikkud) out = stripNikkud(out);
  return out;
};
