import { Fragment, useMemo } from 'react';
import { TehilimSettings } from '@/types/tehilim';
import { getChapter } from '@/data/tehilimData';
import { transformVerse } from '@/lib/textUtils';
import { toHebrewNumeral } from '@/lib/hebrewNumeral';
import { readerFontClass } from '@/lib/readerFont';
import { t } from '@/data/translations';
import { cn } from '@/lib/utils';
import { FavoriteToggle } from '@/components/FavoriteToggle';
import { PrayerBlock } from '@/components/PrayerBlock';
import { PSALM_119_CHAPTER, isLetterStart, letterForVerse } from '@/data/psalm119Letters';
import { isBookEnd, closingPrayerFor } from '@/data/prayers';

interface ChapterBlockProps {
  chapter: number;
  settings: TehilimSettings;
  /** When true, use a quieter title (used inside continuous reader). */
  compact?: boolean;
  /** 1-based inclusive verse window. Used for partial chapters (e.g. 119:1-96). */
  fromVerse?: number;
  toVerse?: number;
  /** Hide the "פרק X" title (used in the perek/favorites reader where the page
      header + nav already show it) — the favourite star is still shown. */
  hideTitle?: boolean;
  /** Hide the favourite star (used when the surrounding nav bar renders it instead). */
  hideStar?: boolean;
}

export const ChapterBlock = ({ chapter, settings, compact = false, fromVerse, toVerse, hideTitle = false, hideStar = false }: ChapterBlockProps) => {
  const chap = getChapter(chapter);
  const { language, prayerFont, fontSize, showCantillation, showNikkud, showVerseNumbers } = settings;

  const fontClass = readerFontClass(prayerFont, showCantillation);

  const verses = useMemo(
    () => chap?.verses.map((v) => transformVerse(v, showCantillation, showNikkud)) ?? [],
    [chap, showCantillation, showNikkud]
  );

  if (!chap) return null;

  const isPsalm119 = chap.chapter === PSALM_119_CHAPTER;
  // Clamp the requested verse window to what the chapter actually has.
  const start = Math.max(1, fromVerse ?? 1);
  const end = Math.min(chap.verseCount, toVerse ?? chap.verseCount);
  const slice = verses.slice(start - 1, end);
  const isPartial = start > 1 || end < chap.verseCount;
  const versesWord = language === 'hebrew' ? 'פסוקים' : language === 'french' ? 'Versets' : 'Verses';
  // Book-completion Yehi Ratzon shown INLINE right after the book-ending psalm
  // (41/72/89/106/150) — e.g. between perek 41 and 42 — not at the section end.
  const closing = end === chap.verseCount && isBookEnd(chap.chapter) ? closingPrayerFor(chap.chapter) : null;

  return (
    <section
      id={`chapter-${chapter}`}
      className={cn(
        'scroll-mt-24',
        compact ? 'pt-6 pb-2 border-t border-border/40 first:border-t-0 first:pt-0' : ''
      )}
    >
      {/* Hebrew numeral first, Arabic digit in small underneath; star (perek reader only) = favorite the whole perek.
          hideTitle: the page header + nav already show "פרק X", so we drop the title and keep just the star. */}
      <header className={cn('relative', hideTitle ? 'h-6 mb-1' : 'mb-3 text-center')}>
        {!hideTitle && (
          <>
            <h2 className={cn('font-david text-foreground', compact ? 'text-xl' : 'text-2xl')} dir="rtl">
              פרק {chap.chapterHebrew}
            </h2>
            <p className="text-[10px] uppercase tracking-[0.2em] font-assistant text-muted-foreground mt-0.5">
              {t('chapter', language)} <span dir="ltr">{chap.chapter}</span>
            </p>
            {isPartial && (
              <p className="text-[10px] tracking-[0.15em] font-assistant text-primary/70 mt-0.5">
                {versesWord} <span dir="ltr">{start}–{end}</span>
                {isPsalm119 && (
                  <span dir="rtl"> · {letterForVerse(start)?.letter}–{letterForVerse(end)?.letter}</span>
                )}
              </p>
            )}
          </>
        )}
        {!compact && !hideStar && (
          <FavoriteToggle chapter={chapter} language={language} className="absolute top-0.5 end-0" />
        )}
      </header>

      <div
        dir="rtl"
        className={cn('space-y-2.5', fontClass)}
        style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}
      >
        {slice.map((text, i) => {
          const verseNum = start + i;
          // Psalm 119 acrostic: a letter heading opens each 8-verse stanza.
          const letter = isPsalm119 && isLetterStart(verseNum) ? letterForVerse(verseNum) : undefined;
          return (
            <Fragment key={verseNum}>
              {letter && (
                <div
                  className="flex items-center justify-center gap-3 pt-5 pb-1 first:pt-1 select-none"
                  dir="rtl"
                >
                  <span className="h-px w-8 bg-primary/25" />
                  <span className="font-david text-2xl leading-none text-primary">{letter.letter}</span>
                  {language !== 'hebrew' && (
                    <span className="text-[10px] uppercase tracking-[0.2em] font-assistant text-muted-foreground">
                      {letter.latin}
                    </span>
                  )}
                  <span className="h-px w-8 bg-primary/25" />
                </div>
              )}
              <p className="text-right text-foreground">
                {showVerseNumbers && (
                  <span className="font-assistant text-xs text-primary/70 align-baseline ms-2 me-1 select-none" dir="rtl">
                    ({toHebrewNumeral(verseNum)})
                  </span>
                )}
                {text}
              </p>
            </Fragment>
          );
        })}
      </div>

      {closing && (
        <div className="mt-5">
          <PrayerBlock title={closing.title[language]} text={closing.text} settings={settings} />
        </div>
      )}
    </section>
  );
};
