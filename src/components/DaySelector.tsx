import { Language, ReadMode } from '@/types/tehilim';
import { getWeeklySchedule, getMonthlySchedule } from '@/data/tehilimData';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { t, dayName } from '@/data/translations';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { Check } from 'lucide-react';

interface DaySelectorProps {
  mode: Extract<ReadMode, 'week' | 'month'>;
  selectedDay: number;
  onDayChange: (day: number) => void;
  onPickChapter: (chapter: number) => void;
  language: Language;
}

export const DaySelector = ({ mode, selectedDay, onDayChange, onPickChapter, language }: DaySelectorProps) => {
  const isRtl = language === 'hebrew';
  const { isRead } = useReadingProgress();

  const days = useMemo(() => (mode === 'week' ? getWeeklySchedule() : getMonthlySchedule()), [mode]);
  const today = useMemo(() => {
    if (mode === 'week') return new Date().getDay() + 1; // 1..7
    return new Date().getDate(); // 1..30 (cap below)
  }, [mode]);

  const currentDay = days.find((d) => d.index === selectedDay);

  return (
    <section className="space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="overflow-x-auto -mx-4 px-4 scrollbar-none">
        <div className="flex gap-2 min-w-max">
          {days.map((d) => {
            const active = d.index === selectedDay;
            const isToday = d.index === today;
            return (
              <button
                key={d.index}
                type="button"
                onClick={() => onDayChange(d.index)}
                className={cn(
                  'shrink-0 rounded-xl px-3 py-2 text-xs md:text-sm font-assistant border transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border text-muted-foreground hover:text-foreground'
                )}
              >
                <div className="flex flex-col items-center gap-0.5">
                  <span className="font-frank text-base">
                    {mode === 'week' ? d.label : d.label /* א׳ etc */}
                  </span>
                  {mode === 'week' && (
                    <span className="text-[10px] uppercase tracking-wide opacity-80">
                      {language === 'hebrew' ? '' : dayName(d.index - 1, language)}
                    </span>
                  )}
                  {isToday && (
                    <span className={cn('text-[9px] uppercase tracking-wider', active ? 'opacity-90' : 'text-primary')}>
                      {t('today', language)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {currentDay && (
        <div className="rounded-2xl border border-border bg-card/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs uppercase tracking-[0.2em] font-assistant text-muted-foreground">
              {t('chaptersOfTheDay', language)}
            </p>
            <p className="text-xs font-assistant text-muted-foreground" dir="ltr">
              {currentDay.range}
            </p>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
            {currentDay.chapters.map((c) => {
              const done = isRead(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => onPickChapter(c)}
                  className={cn(
                    'relative rounded-lg border text-sm font-assistant py-2 transition-colors',
                    done
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'bg-background border-border text-foreground hover:border-primary/40'
                  )}
                >
                  {c}
                  {done && <Check className="absolute top-0.5 right-0.5 w-2.5 h-2.5 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
