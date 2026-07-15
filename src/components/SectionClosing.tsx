import { TehilimSettings } from '@/types/tehilim';
import { sectionEndVerses } from '@/data/prayers';
import { transformVerse } from '@/lib/textUtils';
import { readerFontClass } from '@/lib/readerFont';
import { cn } from '@/lib/utils';

/**
 * Footer of every reading section: the 3 concluding verses (מי יתן מציון…),
 * always shown. The book-completion Yehi Ratzon is NOT here — it renders inline
 * right after its book-ending psalm (see ChapterBlock).
 */
export const SectionClosing = ({ settings }: { settings: TehilimSettings }) => {
  const { language, prayerFont, fontSize, showCantillation, showNikkud, phoneticMode } = settings;
  const phon = phoneticMode && !!sectionEndVerses.textPhonetic;
  const fontClass = readerFontClass(prayerFont, showCantillation);
  const verses = (phon ? sectionEndVerses.textPhonetic! : sectionEndVerses.text)
    .split(/\n\s*\n/)
    .map((v) => (phon ? v.trim() : transformVerse(v.trim(), showCantillation, showNikkud)))
    .filter(Boolean);

  return (
    <div className="rounded-2xl border border-primary/25 bg-primary/[0.04] px-4 py-3">
      <p className="font-david text-base text-foreground mb-2" dir="rtl">{sectionEndVerses.title[language]}</p>
      <div dir={phon ? 'ltr' : 'rtl'} className={cn('space-y-2', phon ? 'font-cormorant text-left' : fontClass)} style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}>
        {verses.map((v, i) => (
          <p key={i} className={phon ? 'text-left text-foreground' : 'text-right text-foreground'}>{v}</p>
        ))}
      </div>
    </div>
  );
};
