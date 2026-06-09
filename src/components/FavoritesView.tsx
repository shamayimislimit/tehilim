import { useState } from 'react';
import { TehilimSettings } from '@/types/tehilim';
import { useFavorites } from '@/hooks/useFavorites';
import { getChapter } from '@/data/tehilimData';
import { transformVerse } from '@/lib/textUtils';
import { PerekNumber } from '@/components/PerekNumber';
import { t } from '@/data/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, X, Check, Trash2 } from 'lucide-react';

interface FavoritesViewProps {
  settings: TehilimSettings;
  onOpenChapter: (chapter: number) => void;
}

export const FavoritesView = ({ settings, onOpenChapter }: FavoritesViewProps) => {
  const { favorites, removeFavorite, renameFavorite } = useFavorites();
  const { language, showCantillation, showNikkud } = settings;
  const isRtl = language === 'hebrew';
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  if (favorites.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center" dir={isRtl ? 'rtl' : 'ltr'}>
        <p className="font-assistant text-sm text-muted-foreground">{t('emptyFavorites', language)}</p>
      </div>
    );
  }

  const startEdit = (id: string, name: string) => {
    setEditing(id);
    setDraft(name);
  };
  const commitEdit = () => {
    if (editing) renameFavorite(editing, draft);
    setEditing(null);
  };

  return (
    <section className="space-y-2.5" dir={isRtl ? 'rtl' : 'ltr'}>
      {favorites.map((f) => {
        const chap = getChapter(f.chapter);
        if (!chap) return null;
        // User-chosen name; without one, fall back to "פרק א׳"
        const displayName = f.name || `פרק ${chap.chapterHebrew}`;
        const snippet = transformVerse(chap.verses[0] ?? '', showCantillation, showNikkud);

        return (
          <div key={f.id} className="rounded-2xl border border-border bg-card/60 p-3 flex items-center gap-3">
            <span className="w-12 shrink-0 rounded-xl bg-primary/10 border border-primary/20 py-1.5 flex justify-center">
              <PerekNumber chapter={f.chapter} hebrewClass="font-david text-base text-primary" />
            </span>

            {editing === f.id ? (
              <Input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); commitEdit(); }
                  if (e.key === 'Escape') setEditing(null);
                }}
                placeholder={t('favoriteNameHint', language)}
                className="h-9 text-sm font-assistant flex-1"
                dir={isRtl ? 'rtl' : 'ltr'}
              />
            ) : (
              <button
                type="button"
                onClick={() => onOpenChapter(f.chapter)}
                className="flex-1 min-w-0 text-start group"
              >
                <p
                  className={`text-lg leading-tight truncate group-hover:text-primary transition-colors ${f.name ? 'font-cormorant' : 'font-david'}`}
                  dir="auto"
                >
                  {displayName}
                </p>
                <p className="font-frank text-sm text-muted-foreground truncate mt-0.5" dir="rtl">
                  {snippet}
                </p>
              </button>
            )}

            <div className="flex items-center gap-1 shrink-0">
              {editing === f.id ? (
                <>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={commitEdit}>
                    <Check className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(null)}>
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </>
              ) : (
                <>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => startEdit(f.id, f.name)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    aria-label={t('removeFromFavorites', language)}
                    onClick={() => removeFavorite(f.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
};
