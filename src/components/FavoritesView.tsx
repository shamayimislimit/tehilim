import { useState } from 'react';
import { Language, PrayerFont, TehilimSettings } from '@/types/tehilim';
import { useFavorites } from '@/hooks/useFavorites';
import { getChapter } from '@/data/tehilimData';
import { transformVerse } from '@/lib/textUtils';
import { t } from '@/data/translations';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Trash2, Pencil, X, Check, ExternalLink } from 'lucide-react';

interface FavoritesViewProps {
  settings: TehilimSettings;
  onOpenChapter: (chapter: number) => void;
}

const PRAYER_FONT_CLASS: Record<PrayerFont, string> = {
  frank: 'font-frank',
  david: 'font-david',
  assistant: 'font-assistant',
};

export const FavoritesView = ({ settings, onOpenChapter }: FavoritesViewProps) => {
  const { collections, removeFavorite, renameCollection, deleteCollection } = useFavorites();
  const { language, prayerFont, fontSize, showCantillation, showNikkud } = settings;
  const fontClass = PRAYER_FONT_CLASS[prayerFont] ?? PRAYER_FONT_CLASS.frank;
  const isRtl = language === 'hebrew';
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  if (collections.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center" dir={isRtl ? 'rtl' : 'ltr'}>
        <p className="font-assistant text-sm text-muted-foreground">{t('emptyFavorites', language)}</p>
      </div>
    );
  }

  const startEdit = (name: string) => {
    setEditing(name);
    setDraft(name);
  };
  const commitEdit = () => {
    if (editing && draft.trim() && draft !== editing) renameCollection(editing, draft.trim());
    setEditing(null);
  };

  return (
    <section className="space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
      {collections.map(({ name, items }) => (
        <Collapsible key={name} defaultOpen className="rounded-2xl border border-border bg-card/60 overflow-hidden">
          <div className="flex items-center justify-between gap-2 px-4 py-3">
            <CollapsibleTrigger className="flex items-center gap-2 text-foreground hover:text-primary transition-colors group flex-1 min-w-0">
              <ChevronDown className="w-4 h-4 transition-transform group-data-[state=closed]:-rotate-90" />
              {editing === name ? (
                <Input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { e.preventDefault(); commitEdit(); }
                    if (e.key === 'Escape') setEditing(null);
                  }}
                  className="h-8 text-sm font-assistant"
                  dir={isRtl ? 'rtl' : 'ltr'}
                />
              ) : (
                <span className="font-cormorant text-lg truncate">{name}</span>
              )}
              <span className="font-assistant text-xs text-muted-foreground shrink-0">
                {items.length}
              </span>
            </CollapsibleTrigger>

            <div className="flex items-center gap-1 shrink-0">
              {editing === name ? (
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
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => startEdit(name)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      if (confirm(`${t('removeFromFavorites', language)} — ${name}?`)) deleteCollection(name);
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </>
              )}
            </div>
          </div>

          <CollapsibleContent>
            <div className={cn('px-4 pb-4 pt-1 space-y-3', fontClass)} style={{ fontSize: `${Math.max(16, fontSize - 4)}px`, lineHeight: 1.85 }}>
              {items.map((f) => {
                const chap = getChapter(f.chapter);
                if (!chap) return null;
                const verseLabel =
                  f.verse === 0
                    ? `${t('chapter', language)} ${f.chapter} — ${t('wholeChapter', language)}`
                    : `${t('chapter', language)} ${f.chapter} · ${t('verse', language)} ${f.verse}`;
                const verseText = f.verse === 0
                  ? chap.verses.map((v) => transformVerse(v, showCantillation, showNikkud)).join(' ')
                  : transformVerse(chap.verses[f.verse - 1] ?? '', showCantillation, showNikkud);

                return (
                  <div key={f.id} className="rounded-xl bg-background/60 border border-border/60 p-3 space-y-1.5">
                    <div className="flex items-center justify-between gap-2" dir={isRtl ? 'rtl' : 'ltr'}>
                      <p className="text-[11px] uppercase tracking-[0.18em] font-assistant text-muted-foreground">
                        {verseLabel}
                      </p>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          aria-label={t('chapter', language)}
                          onClick={() => onOpenChapter(f.chapter)}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          aria-label={t('removeFromFavorites', language)}
                          onClick={() => removeFavorite(f.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <p dir="rtl" className="text-right text-foreground/90">{verseText}</p>
                  </div>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </section>
  );
};
