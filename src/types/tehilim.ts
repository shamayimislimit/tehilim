export type Language = 'hebrew' | 'french' | 'english';
export type PrayerFont = 'frank' | 'david' | 'assistant';
export type ReadMode = 'week' | 'month' | 'number' | 'favorites';

export interface Verse {
  text: string;     // raw with nikkud + cantillation
  index: number;    // 1-based verse number
}

export interface Chapter {
  chapter: number;          // 1..150
  chapterHebrew: string;    // א׳ … קנ׳
  weekDay: number;          // 1..7
  weekDayName: string;      // יום ראשון
  monthDay: number;         // 1..30
  monthDayHebrew: string;   // א׳
  verseCount: number;
  verses: string[];
}

/** A reading unit: a whole chapter, or a verse slice of one (e.g. 119:1-96). */
export interface ReadingSegment {
  chapter: number;
  fromVerse?: number;       // 1-based inclusive; undefined = from the start
  toVerse?: number;         // 1-based inclusive; undefined = to the end
}

export interface ScheduleDay {
  index: number;            // 1..7 or 1..30
  label: string;            // יום ראשון  /  א׳
  labelLatin?: string;      // Sunday (weekly only)
  chapters: number[];       // distinct chapter numbers (pickers / counts)
  segments: ReadingSegment[]; // ordered reading units, supports partial chapters
  range: string;            // "1-29" / "119:1-96"
}

export interface FavoritePerek {
  id: string;               // uuid-ish
  chapter: number;
  name: string;             // optional user label ("Pour Yehouda", "Guérison"…) — '' = none
  addedAt: number;          // epoch ms
}

export interface TehilimSettings {
  fontSize: number;
  language: Language;
  phoneticMode: boolean;    // reserved — no phonetic dataset in v1
  prayerFont: PrayerFont;
  showCantillation: boolean;
  showNikkud: boolean;
  showVerseNumbers: boolean;
  mode: ReadMode;
}
