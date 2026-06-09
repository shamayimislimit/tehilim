import { Language } from '@/types/tehilim';
import { TOTAL_CHAPTERS } from '@/data/tehilimData';
import { PerekNumber } from '@/components/PerekNumber';
import { t } from '@/data/translations';

interface NumberGridProps {
  language: Language;
  onPickChapter: (n: number) => void;
}

export const NumberGrid = ({ language, onPickChapter }: NumberGridProps) => {
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
            className="rounded-lg border bg-card border-border text-foreground hover:border-primary/40 py-1.5 transition-colors flex justify-center"
          >
            <PerekNumber chapter={c} hebrewClass="text-sm" />
          </button>
        ))}
      </div>
    </section>
  );
};
