import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Language } from '@/types/tehilim';
import { t } from '@/data/translations';
import { Star } from 'lucide-react';

interface AddFavoriteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chapter: number;
  verse: number;        // 0 = whole chapter
  language: Language;
  knownCollections: string[];
  onSave: (collection: string) => void;
}

export const AddFavoriteDialog = ({
  open,
  onOpenChange,
  chapter,
  verse,
  language,
  knownCollections,
  onSave,
}: AddFavoriteDialogProps) => {
  const [collection, setCollection] = useState('');
  const isRtl = language === 'hebrew';

  useEffect(() => {
    if (open) setCollection('');
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = collection.trim();
    if (!name) return;
    onSave(name);
    onOpenChange(false);
  };

  const subjectLabel =
    verse === 0
      ? `${t('chapter', language)} ${chapter} — ${t('wholeChapter', language)}`
      : `${t('chapter', language)} ${chapter} · ${t('verse', language)} ${verse}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir={isRtl ? 'rtl' : 'ltr'} className="rounded-2xl">
        <DialogHeader className={isRtl ? 'text-right' : 'text-left'}>
          <DialogTitle className="font-cormorant text-2xl flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            {t('addToFavorites', language)}
          </DialogTitle>
          <DialogDescription className="font-assistant text-sm">{subjectLabel}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-assistant uppercase tracking-wide text-muted-foreground">
              {t('favoriteName', language)}
            </label>
            <Input
              autoFocus
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
              placeholder={t('favoriteNameHint', language)}
              className="font-assistant"
              dir={isRtl ? 'rtl' : 'ltr'}
            />
            {knownCollections.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {knownCollections.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setCollection(name)}
                    className="text-xs font-assistant px-2.5 py-1 rounded-full bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className={isRtl ? 'sm:justify-start gap-2' : 'sm:justify-end gap-2'}>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('cancel', language)}
            </Button>
            <Button type="submit" disabled={!collection.trim()}>
              {t('save', language)}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
