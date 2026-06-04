import { useState, useMemo } from 'react';
import { PrayerFont, TehilimSettings } from '@/types/tehilim';
import { getChapter } from '@/data/tehilimData';
import { transformVerse } from '@/lib/textUtils';
import { useFavorites } from '@/hooks/useFavorites';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { t } from '@/data/translations';
import { Star, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AddFavoriteDialog } from '@/components/AddFavoriteDialog';

interface ChapterBlockProps {
  chapter: number;
  settings: TehilimSettings;
  /** When true, omit the "Mark as read" button and use a quieter title (used inside continuous reader). */
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
  const { isFavorited, addFavorite, knownCollectionNames } = useFavorites();
  const { isRead, toggleRead } = useReadingProgress();
  const [dialogVerse, setDialogVerse] = useState<number | null>(null);

  const fontClass = PRAYER_FONT_CLASS[prayerFont] ?? PRAYER_FONT_CLASS.frank;

  const verses = useMemo(
    () => chap?.verses.map((v) => transformVerse(v, showCantillation, showNikkud)) ?? [],
    [chap, showCantillation, showNikkud]
  );

  if (!chap) return null;

  return (
    <section
      id={`chapter-${chapter}`}
      className={cn(
        'scroll-mt-24',
        compact ? 'pt-6 pb-2 border-t border-border/40 first:border-t-0 first:pt-0' : ''
      )}
    >
      <header className="flex items-center justify-between gap-3 mb-3" dir="ltr">
        <p className="text-xs uppercase tracking-[0.2em] font-assistant text-muted-foreground">
          {t('chapter', language)} {chap.chapter}
        </p>
        <h2 className="font-david text-2xl text-foreground" dir="rtl">{chap.chapterHebrew}</h2>
        {!compact && (
          <Button
            variant={isRead(chapter) ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleRead(chapter)}
            className="font-assistant gap-1.5 rounded-full"
          >
            <Check className="w-3.5 h-3.5" />
            {isRead(chapter) ? t('read', language) : t('markRead', language)}
          </Button>
        )}
      </header>

      <div
        dir="rtl"
        className={cn('space-y-2.5', fontClass)}
        style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}
      >
        {verses.map((text, i) => {
          const verseNum = i + 1;
          const fav = isFavorited(chapter, verseNum);
          return (
            <div key={verseNum} className="group flex items-start gap-2">
              <button
                type="button"
                aria-label={fav ? t('removeFromFavorites', language) : t('addToFavorites', language)}
                onClick={() => setDialogVerse(verseNum)}
                className={cn(
                  'shrink-0 mt-1.5 transition-colors',
                  fav ? 'text-primary' : 'text-muted-foreground/30 hover:text-primary/70'
                )}
              >
                <Star className="w-4 h-4" fill={fav ? 'currentColor' : 'none'} />
              </button>

              <p className="flex-1 text-right text-foreground">
                {showVerseNumbers && (
                  <span className="font-assistant text-xs text-primary/70 align-baseline ms-2 me-1 select-none">
                    {verseNum}.
                  </span>
                )}
                {text}
              </p>
            </div>
          );
        })}
      </div>

      {compact && (
        <div className="mt-4 flex justify-center">
          <Button
            variant={isRead(chapter) ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleRead(chapter)}
            className="font-assistant gap-1.5 rounded-full text-xs"
          >
            <Check className="w-3.5 h-3.5" />
            {isRead(chapter) ? t('read', language) : t('markRead', language)}
          </Button>
        </div>
      )}

      <AddFavoriteDialog
        open={dialogVerse !== null}
        onOpenChange={(o) => !o && setDialogVerse(null)}
        chapter={chapter}
        verse={dialogVerse ?? 0}
        language={language}
        knownCollections={knownCollectionNames}
        onSave={(name) => dialogVerse !== null && addFavorite(chapter, dialogVerse, name)}
      />
    </section>
  );
};
