import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSettings } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { TodayHero } from '@/components/TodayHero';
import { getMonthlySchedule, getWeeklySchedule } from '@/data/tehilimData';
import { getTodayInfo } from '@/lib/hebrewDate';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { t, dayName } from '@/data/translations';
import { cn } from '@/lib/utils';
import { Check, ChevronRight } from 'lucide-react';

interface DayPickerPageProps {
  cycle: 'week' | 'month';
}

const DayPickerPage = ({ cycle }: DayPickerPageProps) => {
  const { settings } = useAppSettings();
  const { language } = settings;
  const isRtl = language === 'hebrew';
  const navigate = useNavigate();
  const { isRead } = useReadingProgress();

  const days = useMemo(() => (cycle === 'week' ? getWeeklySchedule() : getMonthlySchedule()), [cycle]);
  const today = useMemo(() => getTodayInfo(language), [language]);
  const todayIndex = cycle === 'week' ? today.weekday : Math.min(today.monthDay, 30);
  const otherDays = days.filter((d) => d.index !== todayIndex);

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <PageHeader
        language={language}
        title={cycle === 'week' ? t('modeWeek', language) : t('modeMonth', language)}
        subtitle={cycle === 'week' ? t('finishInWeek', language) : t('finishInMonth', language)}
        backTo="/"
      />

      <main className="p-4 space-y-4">
        {/* Today first, prominent */}
        <TodayHero
          language={language}
          cycle={cycle}
          range={days.find((d) => d.index === todayIndex)?.range ?? ''}
          isPicked={false}
          onPick={() => navigate(`/${cycle}/${todayIndex}`)}
        />

        <p className="text-xs uppercase tracking-[0.2em] font-assistant text-muted-foreground text-center pt-1">
          {t('chooseDay', language)}
        </p>

        {cycle === 'week' ? (
          /* Week: one readable row per day */
          <div className="rounded-2xl border border-border bg-card/40 overflow-hidden divide-y divide-border/60">
            {otherDays.map((d) => {
              const allRead = d.chapters.every((c) => isRead(c));
              return (
                <Link
                  key={d.index}
                  to={`/week/${d.index}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-primary/5 transition-colors"
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span className="font-frank text-base truncate">
                      {language === 'hebrew' ? d.label : dayName(d.index - 1, language)}
                    </span>
                    {allRead && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                  </span>
                  <span className="flex items-center gap-2 shrink-0">
                    <span className="font-assistant text-sm text-muted-foreground" dir="ltr">{d.range}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 rtl:rotate-180" />
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Month: compact grid of 30 days */
          <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5">
            {otherDays.map((d) => {
              const allRead = d.chapters.every((c) => isRead(c));
              return (
                <Link
                  key={d.index}
                  to={`/month/${d.index}`}
                  title={d.range}
                  className={cn(
                    'rounded-lg border px-1 py-2 text-center transition-colors flex flex-col items-center gap-0.5',
                    allRead
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'bg-card border-border text-foreground hover:border-primary/40'
                  )}
                >
                  <span className="font-frank text-sm leading-none">{d.label}</span>
                  <span className="text-[9px] font-assistant text-muted-foreground" dir="ltr">{d.range}</span>
                  {allRead && <Check className="w-2.5 h-2.5" />}
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default DayPickerPage;
