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

export interface ScheduleDay {
  index: number;            // 1..7 or 1..30
  label: string;            // יום ראשון  /  א׳
  labelLatin?: string;      // Sunday (weekly only)
  chapters: number[];       // expanded list
  range: string;            // "1-29"
}

export interface FavoriteVerse {
  id: string;               // uuid-ish
  chapter: number;
  verse: number;            // 1-based; 0 means whole chapter
  collection: string;       // user-given name ("Pour Yehouda", "Guérison"…)
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
  lastReadChapter: number;  // for "continuer"
}
