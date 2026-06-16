import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { TehilimSettings } from '@/types/tehilim';
import { transformVerse } from '@/lib/textUtils';
import { readerFontClass } from '@/lib/readerFont';
import { TORAH_BOOK_MAP, RUBRIC_5BOOKS } from '@/data/prayers';
import { cn } from '@/lib/utils';

interface PrayerBlockProps {
  title: string;
  text: string; // paragraphs separated by blank lines
  settings: TehilimSettings;
  defaultOpen?: boolean;
  /** Render flat: always open, no toggle/header (used on a dedicated prayer page
      where the page header already shows the title). */
  flat?: boolean;
}

/** Collapsible prayer (Yehi Ratzon before / after Tehilim), styled like the app. */
export const PrayerBlock = ({ title, text, settings, defaultOpen = false, flat = false }: PrayerBlockProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const { language, prayerFont, fontSize, showCantillation, showNikkud } = settings;
  const fontClass = readerFontClass(prayerFont, showCantillation);
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => transformVerse(p.trim(), showCantillation, showNikkud))
    .filter(Boolean);

  const body = (
    <div
      dir="rtl"
      className={cn(flat ? 'space-y-3' : 'px-4 pb-4 pt-1 space-y-3', fontClass)}
      style={{ fontSize: `${fontSize}px`, lineHeight: 1.9 }}
    >
      {renderParagraphs(paragraphs, language, showCantillation, showNikkud)}
    </div>
  );

  if (flat) return body;

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

      {open && body}
    </div>
  );
};

/** Renders the parsed prayer paragraphs (shared by flat + collapsible modes). */
function renderParagraphs(
  paragraphs: string[],
  language: PrayerBlockProps['settings']['language'],
  showCantillation: boolean,
  showNikkud: boolean,
) {
  return (
    <>
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
            // Lead → 5 ordinals → connecting line → 5 Chumashim, column-aligned
            // (ראשון above בראשית …). `@@BOOKMAP@@` = all blue (grid reference);
            // `@@BOOKMAP:N@@` = only book N blue, the rest greyed (inline, after
            // finishing that book).
            const bm = p.match(/^@@BOOKMAP(?::(\d+))?@@$/);
            if (bm) {
              const tv = (s: string) => transformVerse(s, showCantillation, showNikkud);
              const hi = bm[1] !== undefined ? Number(bm[1]) : null;
              const cellCls = (k: number) =>
                hi === null || hi === k
                  ? 'whitespace-nowrap text-primary font-semibold'
                  : 'whitespace-nowrap text-muted-foreground/40';
              return (
                <div key={i} dir="rtl" className="my-1 rounded-xl border border-border/40 bg-background/40 px-3 py-3">
                  {/* One grid, 5 auto-width columns: each column fits its widest
                      word so nothing is squeezed; ordinal stays above its Chumash. */}
                  <div
                    className="grid gap-x-4 gap-y-1.5 justify-center text-center"
                    style={{ gridTemplateColumns: 'repeat(5, auto)' }}
                  >
                    <p className="col-span-5 text-foreground">{tv('וִיהֵא חָשׁוּב לְפָנֶיךָ קְרִיאַת סֵפֶר')}</p>
                    {TORAH_BOOK_MAP.map((b, k) => (
                      <span key={`o${k}`} className={cellCls(k)}>{tv(b.ordinal)}</span>
                    ))}
                    <p className="col-span-5 text-foreground">{tv('שֶׁבַּתְּהִלִּים שֶׁקָּרָאנוּ לְפָנֶיךָ, שֶׁהוּא כְּנֶגֶד סֵפֶר')}</p>
                    {TORAH_BOOK_MAP.map((b, k) => (
                      <span key={`c${k}`} className={cellCls(k)}>{tv(b.chumash)}</span>
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
    </>
  );
}
