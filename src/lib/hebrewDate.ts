import { HDate } from '@hebcal/core';
import { Language } from '@/types/tehilim';

const HEBREW_MONTHS_FR = [
  '', 'Nissan', 'Iyar', 'Sivan', 'Tamouz', 'Av', 'Eloul',
  'Tichri', 'Hechvan', 'Kislev', 'Tevet', 'Chevat', 'Adar', 'Adar II',
];
const HEBREW_MONTHS_EN = [
  '', 'Nisan', 'Iyar', 'Sivan', 'Tammuz', 'Av', 'Elul',
  'Tishrei', 'Cheshvan', 'Kislev', 'Tevet', 'Shevat', 'Adar', 'Adar II',
];

export interface TodayInfo {
  weekday: number;          // 1..7 (Sunday = 1, Saturday = 7)
  monthDay: number;         // 1..30 — Hebrew day of the Hebrew month
  hebrewDateFull: string;   // "ה׳ סִיוָן תשפ״ו" (HE) or "5 Sivan 5786" (FR/EN)
  gregorianDate: string;    // "04.06.2026"
  weekdayName: string;      // localized weekday name
}

const fmtGregorian = (d: Date): string => {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}.${d.getFullYear()}`;
};

export const getTodayInfo = (language: Language): TodayInfo => {
  const now = new Date();
  const h = new HDate(now);

  const weekdayHeNames = ['', 'יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי', 'שבת'];
  const weekdayFrNames = ['', 'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Chabbat'];
  const weekdayEnNames = ['', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Shabbat'];

  const weekday = now.getDay() + 1;
  const weekdayName =
    language === 'hebrew' ? weekdayHeNames[weekday]
    : language === 'french' ? weekdayFrNames[weekday]
    : weekdayEnNames[weekday];

  let hebrewDateFull: string;
  if (language === 'hebrew') {
    hebrewDateFull = h.renderGematriya();
  } else {
    const monthNames = language === 'french' ? HEBREW_MONTHS_FR : HEBREW_MONTHS_EN;
    const monthName = monthNames[h.getMonth()] ?? '';
    hebrewDateFull = `${h.getDate()} ${monthName} ${h.getFullYear()}`;
  }

  return {
    weekday,
    monthDay: h.getDate(),
    hebrewDateFull,
    gregorianDate: fmtGregorian(now),
    weekdayName,
  };
};
