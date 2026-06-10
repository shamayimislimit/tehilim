/**
 * Psalm 119 is an acrostic: 22 stanzas of 8 verses each (22 × 8 = 176), one per
 * Hebrew letter in order. Verse `v` (1-based) belongs to stanza `(v-1) >> 3`.
 * The monthly cycle splits it on the letter boundary — day 25 = verses 1-96
 * (Alef→Lamed), day 26 = verses 97-176 (Mem→Tav).
 *
 * Latin names sourced from the "תהילים אותיות נשמה" memorial project.
 */
export interface Psalm119Letter {
  letter: string; // the Hebrew letter
  latin: string;  // transliterated name (Alef, Bet, …)
}

export const PSALM_119_CHAPTER = 119;
export const VERSES_PER_LETTER = 8;

export const PSALM_119_LETTERS: Psalm119Letter[] = [
  { letter: 'א', latin: 'Alef' },
  { letter: 'ב', latin: 'Bet' },
  { letter: 'ג', latin: 'Gimel' },
  { letter: 'ד', latin: 'Dalet' },
  { letter: 'ה', latin: 'Heh' },
  { letter: 'ו', latin: 'Vav' },
  { letter: 'ז', latin: 'Zayin' },
  { letter: 'ח', latin: 'Chet' },
  { letter: 'ט', latin: 'Tet' },
  { letter: 'י', latin: 'Yud' },
  { letter: 'כ', latin: 'Kaf' },
  { letter: 'ל', latin: 'Lamed' },
  { letter: 'מ', latin: 'Mem' },
  { letter: 'נ', latin: 'Nun' },
  { letter: 'ס', latin: 'Samech' },
  { letter: 'ע', latin: 'Ayin' },
  { letter: 'פ', latin: 'Peh' },
  { letter: 'צ', latin: 'Tzadi' },
  { letter: 'ק', latin: 'Kuf' },
  { letter: 'ר', latin: 'Resh' },
  { letter: 'ש', latin: 'Shin' },
  { letter: 'ת', latin: 'Tav' },
];

/** Letter (with its 8-verse stanza) that a 1-based verse number belongs to. */
export const letterForVerse = (verseNum: number): Psalm119Letter | undefined =>
  PSALM_119_LETTERS[Math.floor((verseNum - 1) / VERSES_PER_LETTER)];

/** True when this 1-based verse opens a new acrostic stanza. */
export const isLetterStart = (verseNum: number): boolean =>
  (verseNum - 1) % VERSES_PER_LETTER === 0;
