import raw from './tehilim.json';
import { Chapter, ScheduleDay } from '@/types/tehilim';

type RawSchedules = {
  weekly: { days: Record<string, { dayName: string; dayNameEnglish: string; chapters: string }> };
  monthly: { days: Record<string, { dayHebrew: string; chapters: string }> };
};
type RawShape = { chapters: Chapter[]; schedules: RawSchedules; title: string; titleEnglish: string };
const data = raw as unknown as RawShape;

/** Parse "1-29" or "1,2,3-5" → [1, 2, … 29]. */
const expandRange = (spec: string): number[] => {
  const out: number[] = [];
  for (const part of spec.split(',').map((s) => s.trim()).filter(Boolean)) {
    const m = /^(\d+)\s*-\s*(\d+)$/.exec(part);
    if (m) {
      const a = +m[1], b = +m[2];
      for (let i = a; i <= b; i++) out.push(i);
    } else if (/^\d+$/.test(part)) {
      out.push(+part);
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
    .map(([k, v]) => ({
      index: +k,
      label: v.dayName,
      labelLatin: v.dayNameEnglish,
      chapters: expandRange(v.chapters),
      range: v.chapters,
    }))
    .sort((a, b) => a.index - b.index);

export const getMonthlySchedule = (): ScheduleDay[] =>
  Object.entries(data.schedules.monthly.days)
    .map(([k, v]) => ({
      index: +k,
      label: v.dayHebrew,
      chapters: expandRange(v.chapters),
      range: v.chapters,
    }))
    .sort((a, b) => a.index - b.index);
