import { Bookmark } from 'lucide-react';
import { Language } from '@/types/tehilim';
import { TOTAL_CHAPTERS } from '@/data/tehilimData';
import { PerekNumber } from '@/components/PerekNumber';
import { t } from '@/data/translations';
import { cn } from '@/lib/utils';

interface NumberGridProps {
  language: Language;
  onPickChapter: (n: number) => void;
  /** Chapter holding the "where I stopped" bookmark, if any. */
  bookmarkChapter?: number | null;
}

export const NumberGrid = ({ language, onPickChapter, bookmarkChapter }: NumberGridProps) => {
  const isRtl = language === 'hebrew';
  const all = Array.from({ length: TOTAL_CHAPTERS }, (_, i) => i + 1);

  return (
    <section dir={isRtl ? 'rtl' : 'ltr'} className="space-y-3">
      <p className="text-xs uppercase tracking-[0.2em] font-assistant text-muted-foreground text-center">
        {t('pickChapter', language)}
      </p>
      {/* always RTL: א׳ starts top-right whatever the UI language */}
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1.5" dir="rtl">
        {all.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onPickChapter(c)}
            aria-label={c === bookmarkChapter ? `${c} · ${t('bookmark', language)}` : undefined}
            className={cn(
              'relative rounded-lg border py-1.5 transition-colors flex justify-center',
              c === bookmarkChapter
                ? 'bg-primary/10 border-primary text-foreground ring-1 ring-primary'
                : 'bg-card border-border text-foreground hover:border-primary/40'
            )}
          >
            {c === bookmarkChapter && (
              <Bookmark className="absolute -top-1 left-1 w-3.5 h-3.5 text-primary" fill="currentColor" aria-hidden />
            )}
            <PerekNumber chapter={c} hebrewClass="text-sm" />
          </button>
        ))}
      </div>
    </section>
  );
};
