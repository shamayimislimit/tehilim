import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { TehilimSettings } from '@/types/tehilim';
import { transformVerse, stripCantillation } from '@/lib/textUtils';
import { readerFontClass } from '@/lib/readerFont';
import { TORAH_BOOK_MAP, TORAH_BOOK_MAP_PHONETIC, RUBRIC_5BOOKS, MIDDOT_SHEM } from '@/data/prayers';
import { cn } from '@/lib/utils';

interface PrayerBlockProps {
  title: string;
  text: string; // paragraphs separated by blank lines
  /** Phonetic (Latin) version; when phonetic mode is on and this exists, it replaces `text`. */
  textPhonetic?: string;
  settings: TehilimSettings;
  defaultOpen?: boolean;
  /** Render flat: always open, no toggle/header (used on a dedicated prayer page
      where the page header already shows the title). */
  flat?: boolean;
}

/** Collapsible prayer (Yehi Ratzon before / after Tehilim), styled like the app. */
export const PrayerBlock = ({ title, text, textPhonetic, settings, defaultOpen = false, flat = false }: PrayerBlockProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const { language, prayerFont, fontSize, showCantillation, showNikkud, phoneticMode } = settings;
  const phon = phoneticMode && !!textPhonetic;
  const fontClass = readerFontClass(prayerFont, showCantillation);
  const paragraphs = (phon ? textPhonetic! : text)
    .split(/\n\s*\n/)
    .map((p) => (phon ? p.trim() : transformVerse(p.trim(), showCantillation, showNikkud)))
    .filter(Boolean);

  const body = (
    <div
      dir={phon ? 'ltr' : 'rtl'}
      className={cn(flat ? 'space-y-3' : 'px-4 pb-4 pt-1 space-y-3', phon ? 'font-cormorant text-left' : fontClass)}
      style={{ fontSize: `${fontSize}px`, lineHeight: phon ? 1.7 : 1.9 }}
    >
      {renderParagraphs(paragraphs, language, showCantillation, showNikkud, phon)}
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
  phon: boolean,
) {
  return (
    <>
          {paragraphs.map((p, i) => {
            // Distinct divider (e.g. between the מי יתן מציון verse and the
            // Yehi Ratzon that follows it) — a short centered rule with extra room.
            if (p === '@@SEP@@') {
              return (
                <div key={i} className="flex items-center justify-center gap-2 py-1" aria-hidden="true">
                  <span className="h-px w-16 bg-primary/30" />
                  <span className="h-1 w-1 rounded-full bg-primary/40" />
                  <span className="h-px w-16 bg-primary/30" />
                </div>
              );
            }
            // Translated rubric line (comment style) before the five-books line.
            if (p === '@@RUBRIC_5BOOKS@@') {
              return (
                <p
                  key={i}
                  dir={!phon && language === 'hebrew' ? 'rtl' : 'ltr'}
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
              // Book-word cells shrink responsively so the 5 columns always fit
              // a phone width (they were clipped by the parent overflow-hidden on
              // mobile); capped at 0.72em on wide screens. overflow-x-auto is a
              // last-resort safety net (tiny phones / very large reader fonts).
              const cellFont = { fontSize: 'clamp(11px, 3vw, 0.72em)' } as const;
              // Phonetic mode: same column-aligned table, Latin (LTR) words.
              const P = phon ? TORAH_BOOK_MAP_PHONETIC : null;
              const leadLine = P ? P.lead : tv('וִיהֵא חָשׁוּב לְפָנֶיךָ קְרִיאַת סֵפֶר');
              const connectLine = P ? P.connect : tv('שֶׁבַּתְּהִלִּים שֶׁקָּרָאנוּ לְפָנֶיךָ, שֶׁהוּא כְּנֶגֶד סֵפֶר');
              const ordinals = P ? P.ordinals : TORAH_BOOK_MAP.map((b) => tv(b.ordinal));
              const chumashim = P ? P.chumashim : TORAH_BOOK_MAP.map((b) => tv(b.chumash));
              return (
                <div key={i} dir={phon ? 'ltr' : 'rtl'} className="my-1 rounded-xl border border-border/40 bg-background/40 px-3 py-3 overflow-x-auto">
                  {/* One grid, 5 auto-width columns: each column fits its widest
                      word so nothing is squeezed; ordinal stays above its Chumash. */}
                  <div
                    className="grid gap-x-1.5 gap-y-1.5 justify-center text-center"
                    style={{ gridTemplateColumns: 'repeat(5, auto)' }}
                  >
                    <p className="col-span-5 text-foreground text-[0.85em]">{leadLine}</p>
                    {ordinals.map((o, k) => (
                      <span key={`o${k}`} className={cellCls(k)} style={cellFont}>{o}</span>
                    ))}
                    <p className="col-span-5 text-foreground text-[0.85em]">{connectLine}</p>
                    {chumashim.map((c, k) => (
                      <span key={`c${k}`} className={cellCls(k)} style={cellFont}>{c}</span>
                    ))}
                  </div>
                </div>
              );
            }
            // Inline markers inside a paragraph:
            //  [[ … ]]    → rubric/instruction (small, muted grey, like the PDF)
            //  @@SHEMn@@  → the 13-middot Tetragrammaton, kept fully vocalised
            //               (never nikkud-stripped → never shown bare); its te'am
            //               follows the cantillation toggle. "middot jamais nu".
            const parts = p.split(/(\[\[.+?\]\]|@@SHEM[01]@@)/g);
            return (
              <p key={i} dir={phon ? 'ltr' : undefined} className={cn(phon ? 'text-left' : 'text-right', 'text-foreground')}>
                {parts.map((part, j) => {
                  const rubric = /^\[\[(.+?)\]\]$/.exec(part);
                  if (rubric) {
                    return (
                      <span key={j} className="font-assistant text-[0.7em] text-muted-foreground/70 align-middle">
                        {rubric[1]}
                      </span>
                    );
                  }
                  const shem = /^@@SHEM([01])@@$/.exec(part);
                  if (shem) {
                    const name = MIDDOT_SHEM[Number(shem[1])];
                    return <span key={j}>{showCantillation ? name : stripCantillation(name)}</span>;
                  }
                  return <span key={j}>{part}</span>;
                })}
              </p>
            );
          })}
    </>
  );
}
