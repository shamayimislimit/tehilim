import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { PrayerFont, TehilimSettings } from '@/types/tehilim';
import { transformVerse } from '@/lib/textUtils';
import { TORAH_BOOK_MAP, RUBRIC_5BOOKS } from '@/data/prayers';
import { cn } from '@/lib/utils';

const FONT_CLASS: Record<PrayerFont, string> = {
  frank: 'font-frank',
  david: 'font-david',
  assistant: 'font-assistant',
};

interface PrayerBlockProps {
  title: string;
  text: string; // paragraphs separated by blank lines
  settings: TehilimSettings;
  defaultOpen?: boolean;
}

/** Collapsible prayer (Yehi Ratzon before / after Tehilim), styled like the app. */
export const PrayerBlock = ({ title, text, settings, defaultOpen = false }: PrayerBlockProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const { language, prayerFont, fontSize, showCantillation, showNikkud } = settings;
  const fontClass = FONT_CLASS[prayerFont] ?? FONT_CLASS.frank;
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => transformVerse(p.trim(), showCantillation, showNikkud))
    .filter(Boolean);

  return (
    <div className="rounded-2xl border border-primary/25 bg-primary/[0.04] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-start hover:bg-primary/[0.06] transition-colors"
        dir="rtl"
      >
        <span className="font-david text-lg text-foreground leading-tight">{title}</span>
        <ChevronDown className={cn('w-4 h-4 shrink-0 text-primary transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          dir="rtl"
          className={cn('px-4 pb-4 pt-1 space-y-3', fontClass)}
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.9 }}
        >
          {paragraphs.map((p, i) => {
            // Translated rubric line (comment style) before the five-books line.
            if (p === '@@RUBRIC_5BOOKS@@') {
              return (
                <p
                  key={i}
                  dir={language === 'hebrew' ? 'rtl' : 'ltr'}
                  className="font-assistant text-[0.78em] text-muted-foreground/70 text-center"
                >
                  {RUBRIC_5BOOKS[language]}
                </p>
              );
            }
            // Lead line → 5 ordinals → connecting line → 5 Chumashim, with the
            // two rows column-aligned (ראשון above בראשית …).
            if (p === '@@BOOKMAP@@') {
              const tv = (s: string) => transformVerse(s, showCantillation, showNikkud);
              return (
                <div key={i} dir="rtl" className="my-1 rounded-xl border border-border/40 bg-background/40 px-4 py-3 space-y-2 text-center">
                  <p className="text-foreground">{tv('וִיהֵא חָשׁוּב לְפָנֶיךָ קְרִיאַת')}</p>
                  <div className="grid grid-cols-5 divide-x divide-border/30">
                    {TORAH_BOOK_MAP.map((b, k) => (
                      <span key={k} className="px-1 text-primary font-semibold">{tv(b.ordinal)}</span>
                    ))}
                  </div>
                  <p className="text-foreground">{tv('שֶׁבַּתְּהִלִּים שֶׁקָּרָאנוּ')}</p>
                  <div className="grid grid-cols-5 divide-x divide-border/30">
                    {TORAH_BOOK_MAP.map((b, k) => (
                      <span key={k} className="px-1 text-primary font-semibold">{tv(b.chumash)}</span>
                    ))}
                  </div>
                </div>
              );
            }
            // Spans wrapped in [[ … ]] are rubrics/instructions (book choices,
            // (פלונית) placeholders…) — rendered smaller & muted, like the PDF.
            const parts = p.split(/\[\[(.+?)\]\]/g);
            return (
              <p key={i} className="text-right text-foreground">
                {parts.map((part, j) =>
                  j % 2 === 1 ? (
                    <span key={j} className="font-assistant text-[0.7em] text-muted-foreground/70 align-middle">
                      {part}
                    </span>
                  ) : (
                    <span key={j}>{part}</span>
                  )
                )}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
};
