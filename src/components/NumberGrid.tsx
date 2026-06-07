import { Language } from '@/types/tehilim';
import { TOTAL_CHAPTERS } from '@/data/tehilimData';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { t } from '@/data/translations';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface NumberGridProps {
  language: Language;
  onPickChapter: (n: number) => void;
}

export const NumberGrid = ({ language, onPickChapter }: NumberGridProps) => {
  const isRtl = language === 'hebrew';
  const { isRead } = useReadingProgress();
  const all = Array.from({ length: TOTAL_CHAPTERS }, (_, i) => i + 1);

  return (
    <section dir={isRtl ? 'rtl' : 'ltr'} className="space-y-3">
      <p className="text-xs uppercase tracking-[0.2em] font-assistant text-muted-foreground text-center">
        {t('pickChapter', language)}
      </p>
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1.5">
        {all.map((c) => {
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
                  : 'bg-card border-border text-foreground hover:border-primary/40'
              )}
            >
              {c}
              {done && <Check className="absolute top-0.5 end-0.5 w-2.5 h-2.5 text-primary" />}
            </button>
          );
        })}
      </div>
    </section>
  );
};
