import { Bookmark } from 'lucide-react';
import { toast } from 'sonner';
import { Language } from '@/types/tehilim';
import { useProgress } from '@/context/progress';
import { toHebrewNumeral } from '@/lib/hebrewNumeral';
import { t } from '@/data/translations';
import { cn } from '@/lib/utils';

interface BookmarkToggleProps {
  chapter: number;
  language: Language;
  /** Extra classes for the button (positioning). */
  className?: string;
}

/**
 * The single "where I stopped" bookmark. Only one chapter can hold it: setting it
 * on another chapter moves it there; tapping the bookmarked chapter clears it.
 * Stored in settings, so it is per-instance and synced like the other settings.
 */
export const BookmarkToggle = ({ chapter, language, className }: BookmarkToggleProps) => {
  const { settings, updateSettings } = useProgress();
  const active = settings.bookmarkChapter === chapter;

  const toggle = () => {
    updateSettings({ bookmarkChapter: active ? null : chapter });
    toast(active
      ? t('bookmarkRemoved', language)
      : `${t('bookmarkSaved', language)} ${language === 'hebrew' ? toHebrewNumeral(chapter) : chapter}`);
  };

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? t('removeBookmark', language) : t('addBookmark', language)}
      title={active ? t('removeBookmark', language) : t('addBookmark', language)}
      onClick={toggle}
      className={cn(
        'p-1.5 -m-1.5 transition-colors',
        active ? 'text-primary' : 'text-muted-foreground/40 hover:text-primary/70',
        className
      )}
    >
      <Bookmark className="w-5 h-5" fill={active ? 'currentColor' : 'none'} />
    </button>
  );
};
