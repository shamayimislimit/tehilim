import { useState, useMemo } from 'react';
import { Language, PrayerFont, TehilimSettings } from '@/types/tehilim';
import { getChapter } from '@/data/tehilimData';
import { transformVerse } from '@/lib/textUtils';
import { useFavorites } from '@/hooks/useFavorites';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { t } from '@/data/translations';
import { Star, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AddFavoriteDialog } from '@/components/AddFavoriteDialog';

interface ChapterReaderProps {
  chapter: number;
  onChange: (next: number) => void;
  settings: TehilimSettings;
}

const PRAYER_FONT_CLASS: Record<PrayerFont, string> = {
  frank: 'font-frank',
  david: 'font-david',
  assistant: 'font-assistant',
};

export const ChapterReader = ({ chapter, onChange, settings }: ChapterReaderProps) => {
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

  if (!chap) return <div className="p-8 text-center text-muted-foreground">—</div>;

  const handleAddFavorite = (verse: number, name: string) => addFavorite(chapter, verse, name);

  return (
    <article className="space-y-6">
      {/* Chapter navigation */}
      <div className="flex items-center justify-between gap-3" dir="ltr">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => chapter > 1 && onChange(chapter - 1)}
          disabled={chapter <= 1}
          className="font-assistant"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="text-center">
          <h2 className={cn('font-david text-3xl text-foreground')} dir="rtl">
            {chap.chapterHebrew}
          </h2>
          <p className="text-xs uppercase tracking-[0.2em] font-assistant text-muted-foreground mt-1">
            {t('chapter', language)} {chap.chapter}
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => chapter < 150 && onChange(chapter + 1)}
          disabled={chapter >= 150}
          className="font-assistant"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Mark whole chapter as read + favorite whole chapter */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <Button
          variant={isRead(chapter) ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleRead(chapter)}
          className="font-assistant gap-1.5 rounded-full"
        >
          <Check className="w-3.5 h-3.5" />
          {isRead(chapter) ? t('read', language) : t('markRead', language)}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDialogVerse(0)}
          className="font-assistant gap-1.5 rounded-full"
        >
          <Star className="w-3.5 h-3.5" />
          {t('wholeChapter', language)}
        </Button>
      </div>

      {/* Verses */}
      <div
        dir="rtl"
        className={cn('space-y-3', fontClass)}
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

      <AddFavoriteDialog
        open={dialogVerse !== null}
        onOpenChange={(o) => !o && setDialogVerse(null)}
        chapter={chapter}
        verse={dialogVerse ?? 0}
        language={language}
        knownCollections={knownCollectionNames}
        onSave={(name) => dialogVerse !== null && handleAddFavorite(dialogVerse, name)}
      />
    </article>
  );
};
