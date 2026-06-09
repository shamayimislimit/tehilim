import { useState, useMemo } from 'react';
import { PrayerFont, TehilimSettings } from '@/types/tehilim';
import { getChapter } from '@/data/tehilimData';
import { transformVerse } from '@/lib/textUtils';
import { useFavorites } from '@/hooks/useFavorites';
import { t } from '@/data/translations';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AddFavoriteDialog } from '@/components/AddFavoriteDialog';

interface ChapterBlockProps {
  chapter: number;
  settings: TehilimSettings;
  /** When true, use a quieter title (used inside continuous reader). */
  compact?: boolean;
}

const PRAYER_FONT_CLASS: Record<PrayerFont, string> = {
  frank: 'font-frank',
  david: 'font-david',
  assistant: 'font-assistant',
};

export const ChapterBlock = ({ chapter, settings, compact = false }: ChapterBlockProps) => {
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
        {verses.map((text, i) => {
          const verseNum = i + 1;
          return (
            <p key={verseNum} className="text-right text-foreground">
              {showVerseNumbers && (
                <span className="font-assistant text-xs text-primary/70 align-baseline ms-2 me-1 select-none">
                  {verseNum}.
                </span>
              )}
              {text}
            </p>
          );
        })}
      </div>

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
