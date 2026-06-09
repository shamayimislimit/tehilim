import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSettings } from '@/components/Layout';
import { useInstanceLink } from '@/context/instance';
import { PageHeader } from '@/components/PageHeader';
import { TodayHero } from '@/components/TodayHero';
import { getMonthlySchedule, getWeeklySchedule } from '@/data/tehilimData';
import { getTodayInfo } from '@/lib/hebrewDate';
import { t, dayName } from '@/data/translations';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface DayPickerPageProps {
  cycle: 'week' | 'month';
}

const DayPickerPage = ({ cycle }: DayPickerPageProps) => {
  const { settings } = useAppSettings();
  const { language } = settings;
  const isRtl = language === 'hebrew';
  const navigate = useNavigate();
  const iLink = useInstanceLink();

  const days = useMemo(() => (cycle === 'week' ? getWeeklySchedule() : getMonthlySchedule()), [cycle]);
  const today = useMemo(() => getTodayInfo(language), [language]);
  const todayIndex = cycle === 'week' ? today.weekday : Math.min(today.monthDay, 30);

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <PageHeader
        language={language}
        title={cycle === 'week' ? t('modeWeek', language) : t('modeMonth', language)}
        subtitle={cycle === 'week' ? t('finishInWeek', language) : t('finishInMonth', language)}
        backTo={iLink('/')}
      />

      <main className="p-4 space-y-4">
        {/* Today first, prominent */}
        <TodayHero
          language={language}
          cycle={cycle}
          range={days.find((d) => d.index === todayIndex)?.range ?? ''}
          isPicked={false}
          onPick={() => navigate(iLink(`/${cycle}/${todayIndex}`))}
        />

        <p className="text-xs uppercase tracking-[0.2em] font-assistant text-muted-foreground text-center pt-1">
          {t('chooseDay', language)}
        </p>

        {cycle === 'week' ? (
          /* Week: 7-cell grid, always RTL — Hebrew day name, localized weekday in small below */
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5" dir="rtl">
            {days.map((d) => {
              const isToday = d.index === todayIndex;
              return (
                <Link
                  key={d.index}
                  to={iLink(`/week/${d.index}`)}
                  className={cn(
                    'rounded-lg border px-1 py-2.5 text-center transition-colors flex flex-col items-center gap-1',
                    isToday
                      ? 'bg-primary/15 border-primary text-primary ring-2 ring-primary/30 font-semibold'
                      : 'bg-card border-border text-foreground hover:border-primary/40'
                  )}
                >
                  <span className="font-frank text-sm leading-none">{d.label}</span>
                  {language !== 'hebrew' && (
                    <span
                      className={cn('text-[9px] font-assistant leading-none', isToday ? 'text-primary/80' : 'text-muted-foreground')}
                      dir="ltr"
                    >
                      {dayName(d.index - 1, language)}
                    </span>
                  )}
                  {isToday && <Sparkles className="w-2.5 h-2.5" />}
                </Link>
              );
            })}
          </div>
        ) : (
          /* Month: grid of 30 days, always RTL — Hebrew day numeral, digit in small below */
          <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5" dir="rtl">
            {days.map((d) => {
              const isToday = d.index === todayIndex;
              return (
                <Link
                  key={d.index}
                  to={iLink(`/month/${d.index}`)}
                  className={cn(
                    'rounded-lg border px-1 py-2 text-center transition-colors flex flex-col items-center gap-0.5',
                    isToday
                      ? 'bg-primary/15 border-primary text-primary ring-2 ring-primary/30 font-semibold'
                      : 'bg-card border-border text-foreground hover:border-primary/40'
                  )}
                >
                  <span className="font-frank text-sm leading-none">{d.label}</span>
                  <span
                    className={cn('text-[9px] font-assistant leading-none', isToday ? 'text-primary/80' : 'text-muted-foreground')}
                    dir="ltr"
                  >
                    {d.index}
                  </span>
                  {isToday && <Sparkles className="w-2.5 h-2.5" />}
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
