import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useAppSettings } from '@/components/Layout';
import { getTodayInfo } from '@/lib/hebrewDate';
import { getWeeklySchedule, getMonthlySchedule } from '@/data/tehilimData';
import { useFavorites } from '@/hooks/useFavorites';
import { t } from '@/data/translations';
import { Button } from '@/components/ui/button';
import {
  CalendarDays,
  CalendarRange,
  Hash,
  Star,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

const Home = () => {
  const { settings, updateSettings } = useAppSettings();
  const { language, lastReadChapter } = settings;
  const isRtl = language === 'hebrew';
  const { favorites } = useFavorites();

  const today = useMemo(() => getTodayInfo(language), [language]);
  const weekDayIndex = today.weekday;
  const monthDayIndex = Math.min(today.monthDay, 30);

  const todayWeek = useMemo(
    () => getWeeklySchedule().find((d) => d.index === weekDayIndex),
    [weekDayIndex]
  );
  const todayMonth = useMemo(
    () => getMonthlySchedule().find((d) => d.index === monthDayIndex),
    [monthDayIndex]
  );

  const navCards = [
    {
      to: '/week',
      Icon: CalendarDays,
      title: t('modeWeek', language),
      desc: t('finishInWeek', language),
    },
    {
      to: '/month',
      Icon: CalendarRange,
      title: t('modeMonth', language),
      desc: t('finishInMonth', language),
    },
    {
      to: '/perek',
      Icon: Hash,
      title: t('modeNumber', language),
      desc: t('numberDesc', language),
    },
    {
      to: '/favorites',
      Icon: Star,
      title: t('modeFavorites', language),
      desc: favorites.length > 0 ? `${favorites.length} · ${t('favoritesDesc', language)}` : t('favoritesDesc', language),
    },
  ];

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <Header language={language} />

      <main className="p-4 space-y-6">
        {/* Today — direct reading access */}
        <section className="rounded-2xl border border-primary/30 bg-card/70 shadow-[var(--shadow-soft)] overflow-hidden">
          <div className="p-4 md:p-5 pb-3">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-primary/80" />
              <span className="text-[10px] uppercase tracking-[0.25em] font-assistant text-primary/80">
                {t('todayReading', language)}
              </span>
            </div>
            <p className={language === 'hebrew' ? 'font-david text-2xl md:text-3xl' : 'font-cormorant text-2xl md:text-3xl'}>
              {today.weekdayName}
            </p>
            <p className="text-sm font-assistant text-muted-foreground mt-1">
              <span className="font-frank">{today.hebrewDateFull}</span>
              <span className="mx-2 text-muted-foreground/40" aria-hidden>·</span>
              <span dir="ltr" className="inline-block">{today.gregorianDate}</span>
            </p>
          </div>

          <div className="border-t border-border/60 divide-y divide-border/60">
            {todayWeek && (
              <Link
                to={`/week/${weekDayIndex}`}
                className="flex items-center justify-between gap-3 px-4 md:px-5 py-3 hover:bg-primary/5 transition-colors"
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <CalendarDays className="w-4 h-4 text-primary/70 shrink-0" />
                  <span className="font-assistant text-sm truncate">{t('modeWeek', language)}</span>
                </span>
                <span className="flex items-center gap-2 shrink-0">
                  <span className="font-frank text-sm text-muted-foreground" dir="ltr">{todayWeek.range}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50 rtl:rotate-180" />
                </span>
              </Link>
            )}
            {todayMonth && (
              <Link
                to={`/month/${monthDayIndex}`}
                className="flex items-center justify-between gap-3 px-4 md:px-5 py-3 hover:bg-primary/5 transition-colors"
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <CalendarRange className="w-4 h-4 text-primary/70 shrink-0" />
                  <span className="font-assistant text-sm truncate">{t('modeMonth', language)}</span>
                </span>
                <span className="flex items-center gap-2 shrink-0">
                  <span className="font-frank text-sm text-muted-foreground" dir="ltr">{todayMonth.range}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50 rtl:rotate-180" />
                </span>
              </Link>
            )}
          </div>
        </section>

        {/* Navigation cards */}
        <section className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] font-assistant text-muted-foreground text-center">
            {t('whatToRead', language)}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {navCards.map(({ to, Icon, title, desc }) => (
              <Link
                key={to}
                to={to}
                className="group rounded-2xl border border-border bg-card/60 p-4 flex items-center gap-3.5 hover:border-primary/40 hover:bg-card/80 transition-all"
              >
                <span className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Icon className="w-[18px] h-[18px] text-primary" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className={`block ${language === 'hebrew' ? 'font-david text-lg' : 'font-cormorant text-lg'} leading-tight`}>
                    {title}
                  </span>
                  <span className="block text-xs font-assistant text-muted-foreground truncate">
                    {desc}
                  </span>
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary/60 transition-colors rtl:rotate-180 shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* Continue reading */}
        {lastReadChapter > 0 && (
          <div className="rounded-2xl border border-border bg-card/40 p-3 flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.18em] font-assistant text-muted-foreground">
              {t('continueReading', language)}
            </p>
            <Button size="sm" asChild className="font-assistant">
              <Link to={`/perek/${lastReadChapter}`}>
                {t('chapter', language)} {lastReadChapter}
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
