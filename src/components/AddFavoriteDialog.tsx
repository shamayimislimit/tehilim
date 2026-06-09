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
import { getChapter } from '@/data/tehilimData';
import { t } from '@/data/translations';
import { Star } from 'lucide-react';

interface AddFavoriteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chapter: number;
  language: Language;
  /** Name is optional — '' means the list falls back to "פרק א׳". */
  onSave: (name: string) => void;
}

export const AddFavoriteDialog = ({
  open,
  onOpenChange,
  chapter,
  language,
  onSave,
}: AddFavoriteDialogProps) => {
  const [name, setName] = useState('');
  const isRtl = language === 'hebrew';
  const hebrew = getChapter(chapter)?.chapterHebrew ?? String(chapter);

  useEffect(() => {
    if (open) setName('');
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(name.trim());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir={isRtl ? 'rtl' : 'ltr'} className="rounded-2xl">
        <DialogHeader className="text-start sm:text-start">
          <DialogTitle className="font-cormorant text-2xl flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            {t('addToFavorites', language)}
          </DialogTitle>
          <DialogDescription className="font-assistant text-sm">
            <span className="font-david text-base text-foreground" dir="rtl">פרק {hebrew}</span>
            <span className="mx-1.5 text-muted-foreground/50" aria-hidden>·</span>
            <span dir="ltr">{t('chapter', language)} {chapter}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-assistant uppercase tracking-wide text-muted-foreground">
              {t('favoriteName', language)}
            </label>
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('favoriteNameHint', language)}
              className="font-assistant"
              dir={isRtl ? 'rtl' : 'ltr'}
            />
          </div>

          <DialogFooter className="sm:justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('cancel', language)}
            </Button>
            <Button type="submit">
              {t('save', language)}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
