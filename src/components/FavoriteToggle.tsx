import { useState } from 'react';
import { Star } from 'lucide-react';
import { Language } from '@/types/tehilim';
import { useFavorites } from '@/hooks/useFavorites';
import { AddFavoriteDialog } from '@/components/AddFavoriteDialog';
import { t } from '@/data/translations';
import { cn } from '@/lib/utils';

interface FavoriteToggleProps {
  chapter: number;
  language: Language;
  /** Extra classes for the button (positioning, e.g. absolute placement in a nav row). */
  className?: string;
}

/**
 * The "favourite this whole perek" star + its naming dialog, self-contained.
 * Filled `text-primary` when favourited, muted outline otherwise — identical to
 * the active star toggled elsewhere. Shared by the perek reader nav bar and the
 * chapter block header so the favourite logic lives in one place.
 */
export const FavoriteToggle = ({ chapter, language, className }: FavoriteToggleProps) => {
  const { isFavorited, addFavorite, removeChapter } = useFavorites();
  const [dialogOpen, setDialogOpen] = useState(false);
  const fav = isFavorited(chapter);

  return (
    <>
      <button
        type="button"
        aria-label={fav ? t('removeFromFavorites', language) : t('addToFavorites', language)}
        onClick={() => (fav ? removeChapter(chapter) : setDialogOpen(true))}
        className={cn(
          'transition-colors',
          fav ? 'text-primary' : 'text-muted-foreground/40 hover:text-primary/70',
          className
        )}
      >
        <Star className="w-5 h-5" fill={fav ? 'currentColor' : 'none'} />
      </button>

      <AddFavoriteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        chapter={chapter}
        language={language}
        onSave={(name) => addFavorite(chapter, name)}
      />
    </>
  );
};
