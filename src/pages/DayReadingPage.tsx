import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useAppSettings } from '@/components/Layout';
import { useInstanceLink } from '@/context/instance';
import { PageHeader } from '@/components/PageHeader';
import { DayContinuousReader } from '@/components/DayContinuousReader';
import { getMonthlySchedule, getWeeklySchedule } from '@/data/tehilimData';
import { getTodayInfo } from '@/lib/hebrewDate';
import { t, dayName } from '@/data/translations';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface DayReadingPageProps {
  cycle: 'week' | 'month';
}

const DayReadingPage = ({ cycle }: DayReadingPageProps) => {
  const { settings } = useAppSettings();
  const { language } = settings;
  const isRtl = language === 'hebrew';
  const iLink = useInstanceLink();
  const { day: dayParam } = useParams();
  const day = Number(dayParam);

  const days = useMemo(() => (cycle === 'week' ? getWeeklySchedule() : getMonthlySchedule()), [cycle]);
  const max = cycle === 'week' ? 7 : 30;
  const today = useMemo(() => getTodayInfo(language), [language]);
  const todayIndex = cycle === 'week' ? today.weekday : Math.min(today.monthDay, 30);

  if (!Number.isInteger(day) || day < 1 || day > max) {
    return <Navigate to={iLink(`/${cycle}`)} replace />;
  }

  const sched = days.find((d) => d.index === day);
  if (!sched) return <Navigate to={iLink(`/${cycle}`)} replace />;

  const isToday = day === todayIndex;
  const title =
    cycle === 'week'
      ? language === 'hebrew' ? sched.label : dayName(day - 1, language)
      : `${t('day', language)} ${language === 'hebrew' ? sched.label : day}`;

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <PageHeader
        language={language}
        title={title}
        subtitle={isToday ? today.hebrewDateFull : sched.range}
        backTo={iLink(`/${cycle}`)}
      />

      <main className="p-4 space-y-4">
        {/* Day navigation — follows reading direction, arrows mirrored in RTL */}
        <div className="flex items-center justify-between gap-3">
          <Link
            to={iLink(day > 1 ? `/${cycle}/${day - 1}` : `/${cycle}`)}
            aria-disabled={day <= 1}
            className={`p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors ${day <= 1 ? 'opacity-30 pointer-events-none' : ''}`}
          >
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          </Link>

          <div className="text-center">
            {isToday && (
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] font-assistant text-primary/80">
                <Sparkles className="w-3 h-3" />
                {t('today', language)}
              </span>
            )}
            <p className="text-xs uppercase tracking-[0.18em] font-assistant text-muted-foreground" dir="ltr">
              {sched.range}
            </p>
          </div>

          <Link
            to={iLink(day < max ? `/${cycle}/${day + 1}` : `/${cycle}`)}
            aria-disabled={day >= max}
            className={`p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors ${day >= max ? 'opacity-30 pointer-events-none' : ''}`}
          >
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>

        <DayContinuousReader segments={sched.segments} settings={settings} />
      </main>
    </div>
  );
};

export default DayReadingPage;
