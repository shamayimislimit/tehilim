import { Language } from '@/types/tehilim';
import { getTodayInfo } from '@/lib/hebrewDate';
import { t } from '@/data/translations';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TodayHeroProps {
  language: Language;
  /** "week" → uses today.weekday; "month" → uses today.monthDay */
  cycle: 'week' | 'month';
  /** Range string of chapters for today, e.g. "1-29" */
  range: string;
  /** Whether today is currently the picked day */
  isPicked: boolean;
  onPick: () => void;
}

export const TodayHero = ({ language, cycle, range, isPicked, onPick }: TodayHeroProps) => {
  const today = getTodayInfo(language);
  const isRtl = language === 'hebrew';
  const dayLabel = cycle === 'week' ? today.weekdayName : `${t('day', language)} ${today.monthDay}`;

  return (
    <button
      type="button"
      onClick={onPick}
      className={cn(
        'w-full text-start rounded-2xl border p-4 md:p-5 transition-all',
        'flex items-center justify-between gap-4',
        isPicked
          ? 'bg-primary/10 border-primary/40 shadow-[var(--shadow-soft)]'
          : 'bg-card/70 border-border hover:border-primary/40'
      )}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className={cn('w-3.5 h-3.5', isPicked ? 'text-primary' : 'text-primary/70')} />
          <span className="text-[10px] uppercase tracking-[0.25em] font-assistant text-primary/80">
            {t('today', language)}
          </span>
        </div>
        <p className={cn(
          'truncate',
          language === 'hebrew' ? 'font-david text-2xl md:text-3xl' : 'font-cormorant text-2xl md:text-3xl'
        )}>
          {dayLabel}
        </p>
        <p className="text-sm font-assistant text-muted-foreground mt-1">
          <span className="font-frank">{today.hebrewDateFull}</span>
          <span className="mx-2 text-muted-foreground/40" aria-hidden>·</span>
          <span dir="ltr" className="inline-block">{today.gregorianDate}</span>
        </p>
      </div>
      <div className="text-end shrink-0">
        <p className="text-[10px] uppercase tracking-[0.18em] font-assistant text-muted-foreground">
          {t('chaptersOfTheDay', language)}
        </p>
        <p className="font-frank text-lg" dir="ltr">{range}</p>
      </div>
    </button>
  );
};
