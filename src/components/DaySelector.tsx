import { useMemo } from 'react';
import { TehilimSettings, ReadMode } from '@/types/tehilim';
import { getMonthlySchedule, getWeeklySchedule } from '@/data/tehilimData';
import { getTodayInfo } from '@/lib/hebrewDate';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { t, dayName } from '@/data/translations';
import { TodayHero } from '@/components/TodayHero';
import { DayContinuousReader } from '@/components/DayContinuousReader';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface DaySelectorProps {
  mode: Extract<ReadMode, 'week' | 'month'>;
  selectedDay: number;
  onDayChange: (day: number) => void;
  settings: TehilimSettings;
}

export const DaySelector = ({ mode, selectedDay, onDayChange, settings }: DaySelectorProps) => {
  const { language } = settings;
  const isRtl = language === 'hebrew';
  const { isRead } = useReadingProgress();

  const days = useMemo(() => (mode === 'week' ? getWeeklySchedule() : getMonthlySchedule()), [mode]);
  const today = useMemo(() => getTodayInfo(language), [language]);
  const todayIndex = mode === 'week' ? today.weekday : Math.min(today.monthDay, 30);

  const currentDay = days.find((d) => d.index === selectedDay);
  const todayDay = days.find((d) => d.index === todayIndex);
  const otherDays = days.filter((d) => d.index !== todayIndex);

  return (
    <section className="space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* TODAY hero */}
      {todayDay && (
        <TodayHero
          language={language}
          cycle={mode}
          range={todayDay.range}
          isPicked={selectedDay === todayIndex}
          onPick={() => onDayChange(todayIndex)}
        />
      )}

      {/* Other days */}
      <details className="rounded-2xl border border-border bg-card/40 overflow-hidden group">
        <summary className="px-4 py-2.5 cursor-pointer list-none flex items-center justify-between text-xs uppercase tracking-[0.18em] font-assistant text-muted-foreground hover:text-foreground select-none">
          <span>{mode === 'week' ? (language === 'hebrew' ? 'ימים אחרים' : language === 'french' ? 'Autres jours' : 'Other days') : (language === 'hebrew' ? 'ימי החודש' : language === 'french' ? 'Jours du mois' : 'Days of the month')}</span>
          <span className="text-muted-foreground/60 group-open:rotate-180 transition-transform">▾</span>
        </summary>
        <div className="px-3 pb-3">
          <div className={mode === 'week'
            ? 'grid grid-cols-7 gap-1.5'
            : 'grid grid-cols-6 sm:grid-cols-10 gap-1.5'}>
            {otherDays.map((d) => {
              const allRead = d.chapters.every((c) => isRead(c));
              const active = d.index === selectedDay;
              return (
                <button
                  key={d.index}
                  type="button"
                  onClick={() => onDayChange(d.index)}
                  className={cn(
                    'rounded-lg border px-1 py-2 text-xs font-assistant transition-colors flex flex-col items-center gap-0.5',
                    active
                      ? 'bg-primary text-primary-foreground border-primary'
                      : allRead
                        ? 'bg-primary/10 border-primary/30 text-primary'
                        : 'bg-background border-border text-foreground hover:border-primary/40'
                  )}
                  title={d.range}
                >
                  <span className="font-frank text-sm">{d.label}</span>
                  {mode === 'week' && language !== 'hebrew' && (
                    <span className="text-[9px] uppercase opacity-70">{dayName(d.index - 1, language).slice(0, 3)}</span>
                  )}
                  {allRead && <Check className="w-2.5 h-2.5" />}
                </button>
              );
            })}
          </div>
        </div>
      </details>

      {/* Selected day — continuous reader */}
      {currentDay && (
        <DayContinuousReader
          chapters={currentDay.chapters}
          settings={settings}
          scrollKey={`${mode}-${selectedDay}`}
        />
      )}
    </section>
  );
};
