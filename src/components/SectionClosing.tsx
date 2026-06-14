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
  const { language, prayerFont, fontSize, showCantillation, showNikkud } = settings;
  const fontClass = readerFontClass(prayerFont, showCantillation);
  const verses = sectionEndVerses.text
    .split(/\n\s*\n/)
    .map((v) => transformVerse(v.trim(), showCantillation, showNikkud))
    .filter(Boolean);

  return (
    <div className="rounded-2xl border border-primary/25 bg-primary/[0.04] px-4 py-3">
      <p className="font-david text-base text-foreground mb-2" dir="rtl">{sectionEndVerses.title[language]}</p>
      <div dir="rtl" className={cn('space-y-2', fontClass)} style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}>
        {verses.map((v, i) => (
          <p key={i} className="text-right text-foreground">{v}</p>
        ))}
      </div>
    </div>
  );
};
