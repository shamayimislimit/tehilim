import { Fragment, useState, useMemo } from 'react';
import { PrayerFont, TehilimSettings } from '@/types/tehilim';
import { getChapter } from '@/data/tehilimData';
import { transformVerse } from '@/lib/textUtils';
import { useFavorites } from '@/hooks/useFavorites';
import { t } from '@/data/translations';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AddFavoriteDialog } from '@/components/AddFavoriteDialog';
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
}

const PRAYER_FONT_CLASS: Record<PrayerFont, string> = {
  frank: 'font-frank',
  david: 'font-david',
  assistant: 'font-assistant',
};

export const ChapterBlock = ({ chapter, settings, compact = false, fromVerse, toVerse }: ChapterBlockProps) => {
  const chap = getChapter(chapter);
  const { language, prayerFont, fontSize, showCantillation, showNikkud, showVerseNumbers } = settings;
  const { isFavorited, addFavorite, removeChapter } = useFavorites();
  const [dialogOpen, setDialogOpen] = useState(false);

  const fontClass = PRAYER_FONT_CLASS[prayerFont] ?? PRAYER_FONT_CLASS.frank;

  const verses = useMemo(
    () => chap?.verses.map((v) => transformVerse(v, showCantillation, showNikkud)) ?? [],
    [chap, showCantillation, showNikkud]
  );

  if (!chap) return null;

  const fav = isFavorited(chapter);
  const isPsalm119 = chap.chapter === PSALM_119_CHAPTER;
  // Clamp the requested verse window to what the chapter actually has.
  const start = Math.max(1, fromVerse ?? 1);
  const end = Math.min(chap.verseCount, toVerse ?? chap.verseCount);
  const slice = verses.slice(start - 1, end);
  const isPartial = start > 1 || end < chap.verseCount;
  const versesWord = language === 'hebrew' ? 'פסוקים' : language === 'french' ? 'Versets' : 'Verses';
  // Closing Yehi Ratzon after a book-ending psalm (41/72/89/106/150) — only
  // when the whole chapter is shown (book-enders are never split).
  const closing = end === chap.verseCount && isBookEnd(chap.chapter) ? closingPrayerFor(chap.chapter) : null;

  return (
    <section
      id={`chapter-${chapter}`}
      className={cn(
        'scroll-mt-24',
        compact ? 'pt-6 pb-2 border-t border-border/40 first:border-t-0 first:pt-0' : ''
      )}
    >
      {/* Hebrew numeral first, Arabic digit in small underneath; star (perek reader only) = favorite the whole perek */}
      <header className="relative mb-3 text-center">
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
        {!compact && (
          <button
            type="button"
            aria-label={fav ? t('removeFromFavorites', language) : t('addToFavorites', language)}
            onClick={() => (fav ? removeChapter(chapter) : setDialogOpen(true))}
            className={cn(
              'absolute top-0.5 end-0 transition-colors',
              fav ? 'text-primary' : 'text-muted-foreground/40 hover:text-primary/70'
            )}
          >
            <Star className="w-5 h-5" fill={fav ? 'currentColor' : 'none'} />
          </button>
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
                  <span className="font-assistant text-xs text-primary/70 align-baseline ms-2 me-1 select-none">
                    {verseNum}.
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

      {!compact && (
        <AddFavoriteDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          chapter={chapter}
          language={language}
          onSave={(name) => addFavorite(chapter, name)}
        />
      )}
    </section>
  );
};
