/**
 * Hebrew gematria numerals (1..). Used for small verse labels like "(א)".
 * Handles the 15/16 → טו/טז exception. Plain letters, no geresh/gershayim
 * (the chapter title uses gershayim separately; verse labels stay minimal).
 */
const ONES = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
const TENS = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
const HUNDREDS = ['', 'ק', 'ר', 'ש', 'ת', 'תק', 'תר', 'תש', 'תת', 'תתק'];

export const toHebrewNumeral = (n: number): string => {
  if (!Number.isInteger(n) || n <= 0) return String(n);
  let out = HUNDREDS[Math.floor(n / 100)] ?? '';
  const rem = n % 100;
  if (rem === 15) out += 'טו';
  else if (rem === 16) out += 'טז';
  else {
    out += TENS[Math.floor(rem / 10)];
    out += ONES[rem % 10];
  }
  return out;
};
