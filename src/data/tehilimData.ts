import raw from './tehilim.json';
import { Chapter, ReadingSegment, ScheduleDay } from '@/types/tehilim';

type RawSchedules = {
  weekly: { days: Record<string, { dayName: string; dayNameEnglish: string; chapters: string }> };
  monthly: { days: Record<string, { dayHebrew: string; chapters: string }> };
};
type RawShape = { chapters: Chapter[]; schedules: RawSchedules; title: string; titleEnglish: string };
const data = raw as unknown as RawShape;

/**
 * Parse a schedule spec into ordered reading segments. Supports:
 *   "1-29"        → whole chapters 1..29
 *   "35,38"       → chapters 35 and 38
 *   "119:1-96"    → chapter 119, verses 1-96 (partial chapter, e.g. month day 25)
 *   "119:97-176"  → chapter 119, verses 97-176
 * The verse syntax is what makes Tehilim 119 (split across month days 25/26 on
 * the letter boundary ל/מ) render at all — a plain number parser dropped it.
 */
const parseSegments = (spec: string): ReadingSegment[] => {
  const out: ReadingSegment[] = [];
  for (const part of spec.split(',').map((s) => s.trim()).filter(Boolean)) {
    let m: RegExpExecArray | null;
    if ((m = /^(\d+)\s*:\s*(\d+)\s*-\s*(\d+)$/.exec(part))) {
      out.push({ chapter: +m[1], fromVerse: +m[2], toVerse: +m[3] });
    } else if ((m = /^(\d+)\s*:\s*(\d+)$/.exec(part))) {
      out.push({ chapter: +m[1], fromVerse: +m[2], toVerse: +m[2] });
    } else if ((m = /^(\d+)\s*-\s*(\d+)$/.exec(part))) {
      for (let i = +m[1]; i <= +m[2]; i++) out.push({ chapter: i });
    } else if (/^\d+$/.test(part)) {
      out.push({ chapter: +part });
    }
  }
  return out;
};

/** Distinct chapter numbers in encounter order (for pickers / counts). */
const distinctChapters = (segments: ReadingSegment[]): number[] => {
  const seen = new Set<number>();
  const out: number[] = [];
  for (const s of segments) {
    if (!seen.has(s.chapter)) {
      seen.add(s.chapter);
      out.push(s.chapter);
    }
  }
  return out;
};

export const TOTAL_CHAPTERS = 150;

export const getAllChapters = (): Chapter[] => data.chapters;

export const getChapter = (n: number): Chapter | undefined =>
  data.chapters.find((c) => c.chapter === n);

export const getWeeklySchedule = (): ScheduleDay[] =>
  Object.entries(data.schedules.weekly.days)
    .map(([k, v]) => {
      const segments = parseSegments(v.chapters);
      return {
        index: +k,
        label: v.dayName,
        labelLatin: v.dayNameEnglish,
        chapters: distinctChapters(segments),
        segments,
        range: v.chapters,
      };
    })
    .sort((a, b) => a.index - b.index);

export const getMonthlySchedule = (): ScheduleDay[] =>
  Object.entries(data.schedules.monthly.days)
    .map(([k, v]) => {
      const segments = parseSegments(v.chapters);
      return {
        index: +k,
        label: v.dayHebrew,
        chapters: distinctChapters(segments),
        segments,
        range: v.chapters,
      };
    })
    .sort((a, b) => a.index - b.index);
