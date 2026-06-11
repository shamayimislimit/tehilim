import { PrayerFont, TehilimSettings } from '@/types/tehilim';
import { PrayerBlock } from '@/components/PrayerBlock';
import { sectionEndVerses, isBookEnd, closingPrayerFor } from '@/data/prayers';
import { transformVerse } from '@/lib/textUtils';
import { cn } from '@/lib/utils';

const FONT_CLASS: Record<PrayerFont, string> = {
  frank: 'font-frank',
  david: 'font-david',
  assistant: 'font-assistant',
};

/**
 * Footer of every reading section:
 *  - the 3 concluding verses (מי יתן מציון…), always shown;
 *  - the full Yehi Ratzon (collapsible) for each book-ending psalm present
 *    in this section (41/72/89/106/150) with the right book / "five books".
 */
export const SectionClosing = ({ chapters, settings }: { chapters: number[]; settings: TehilimSettings }) => {
  const { language, prayerFont, fontSize, showCantillation, showNikkud } = settings;
  const fontClass = FONT_CLASS[prayerFont] ?? FONT_CLASS.frank;
  const verses = sectionEndVerses.text
    .split(/\n\s*\n/)
    .map((v) => transformVerse(v.trim(), showCantillation, showNikkud))
    .filter(Boolean);
  const bookClosings = chapters.filter(isBookEnd).map((c) => closingPrayerFor(c)).filter(Boolean) as NonNullable<
    ReturnType<typeof closingPrayerFor>
  >[];

  return (
    <div className="space-y-3">
      {/* Concluding verses — always shown */}
      <div className="rounded-2xl border border-primary/25 bg-primary/[0.04] px-4 py-3">
        <p className="font-david text-base text-foreground mb-2" dir="rtl">{sectionEndVerses.title[language]}</p>
        <div dir="rtl" className={cn('space-y-2', fontClass)} style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}>
          {verses.map((v, i) => (
            <p key={i} className="text-right text-foreground">{v}</p>
          ))}
        </div>
      </div>

      {/* Book-completion Yehi Ratzon (collapsible) */}
      {bookClosings.map((c, i) => (
        <PrayerBlock key={i} title={c.title[language]} text={c.text} settings={settings} />
      ))}
    </div>
  );
};
