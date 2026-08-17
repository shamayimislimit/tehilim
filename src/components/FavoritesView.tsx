import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FavoritePerek, TehilimSettings } from '@/types/tehilim';
import { useFavorites } from '@/hooks/useFavorites';
import { TOTAL_CHAPTERS, getChapter } from '@/data/tehilimData';
import { transformVerse } from '@/lib/textUtils';
import { PerekNumber } from '@/components/PerekNumber';
import { t } from '@/data/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GripVertical, Pencil, X, Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FavoritesViewProps {
  settings: TehilimSettings;
  onOpenChapter: (chapter: number) => void;
}

/** Raw chapter input → a valid chapter number, or null while it isn't one yet. */
const parseChapter = (raw: string): number | null => {
  const n = Number(raw.trim());
  return raw.trim() !== '' && Number.isInteger(n) && n >= 1 && n <= TOTAL_CHAPTERS ? n : null;
};

/** What the edit row holds while open — chapter stays a raw string until commit. */
interface Draft {
  chapter: string;
  name: string;
}

interface RowProps {
  fav: FavoritePerek;
  settings: TehilimSettings;
  onOpenChapter: (chapter: number) => void;
  editing: boolean;
  draft: Draft;
  setDraft: (updates: Partial<Draft>) => void;
  /** null = the draft is valid and can be saved; otherwise a translated reason. */
  error: string | null;
  startEdit: (fav: FavoritePerek) => void;
  commitEdit: () => void;
  cancelEdit: () => void;
  removeFavorite: (id: string) => void;
}

const SortableRow = ({
  fav,
  settings,
  onOpenChapter,
  editing,
  draft,
  setDraft,
  error,
  startEdit,
  commitEdit,
  cancelEdit,
  removeFavorite,
}: RowProps) => {
  const { language, showCantillation, showNikkud } = settings;
  const isRtl = language === 'hebrew';
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: fav.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const chap = getChapter(fav.chapter);
  if (!chap) return null;
  const displayName = fav.name || `פרק ${chap.chapterHebrew}`;
  const snippet = transformVerse(chap.verses[0] ?? '', showCantillation, showNikkud);
  // Live Hebrew numeral under the number field, so the typed digit is verified in Hebrew.
  const draftHebrew = getChapter(parseChapter(draft.chapter) ?? 0)?.chapterHebrew ?? '';
  const chapterInvalid = editing && parseChapter(draft.chapter) === null;

  const onFieldKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); commitEdit(); }
    if (e.key === 'Escape') cancelEdit();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'rounded-2xl border border-border bg-card/60 p-3',
        isDragging && 'opacity-80 shadow-[var(--shadow-elegant)] ring-1 ring-primary/30 z-10'
      )}
    >
      <div className="flex items-center gap-2">
      {/* Drag handle — long-press (mobile) or grab (desktop) to reorder */}
      <button
        type="button"
        aria-label={t('reorder', language)}
        className="shrink-0 -ms-1 p-1 text-muted-foreground/50 hover:text-primary touch-none cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {editing ? (
        /* Editing: the badge becomes the chapter field (Hebrew numeral echoed underneath). */
        <span className="w-11 shrink-0 flex flex-col items-center gap-0.5">
          <Input
            value={draft.chapter}
            onChange={(e) => setDraft({ chapter: e.target.value.replace(/[^\d]/g, '').slice(0, 3) })}
            onFocus={(e) => e.currentTarget.select()}
            onKeyDown={onFieldKeyDown}
            inputMode="numeric"
            aria-label={t('favoriteChapter', language)}
            aria-invalid={chapterInvalid}
            className={cn(
              'h-9 w-11 px-1 text-center text-sm font-assistant',
              chapterInvalid && 'border-destructive focus-visible:ring-destructive'
            )}
            dir="ltr"
          />
          <span className="font-david text-[11px] leading-none text-primary h-3" dir="rtl">
            {draftHebrew}
          </span>
        </span>
      ) : (
        <span className="w-11 shrink-0 rounded-xl bg-primary/10 border border-primary/20 py-1.5 flex justify-center">
          <PerekNumber chapter={fav.chapter} hebrewClass="font-david text-base text-primary" />
        </span>
      )}

      {editing ? (
        <Input
          autoFocus
          value={draft.name}
          onChange={(e) => setDraft({ name: e.target.value })}
          onKeyDown={onFieldKeyDown}
          placeholder={t('favoriteNameHint', language)}
          className="h-9 text-sm font-assistant flex-1"
          dir={isRtl ? 'rtl' : 'ltr'}
        />
      ) : (
        <button type="button" onClick={() => onOpenChapter(fav.chapter)} className="flex-1 min-w-0 text-start group">
          <p
            className={`text-lg leading-tight truncate group-hover:text-primary transition-colors ${fav.name ? 'font-cormorant' : 'font-david'}`}
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
        {editing ? (
          <>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={commitEdit} disabled={!!error}>
              <Check className="w-3.5 h-3.5" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={cancelEdit}>
              <X className="w-3.5 h-3.5" />
            </Button>
          </>
        ) : (
          <>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              aria-label={t('editFavorite', language)}
              onClick={() => startEdit(fav)}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              aria-label={t('removeFromFavorites', language)}
              onClick={() => removeFavorite(fav.id)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </>
        )}
      </div>
      </div>

      {editing && error && (
        <p className="mt-2 ms-14 text-xs font-assistant text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export const FavoritesView = ({ settings, onOpenChapter }: FavoritesViewProps) => {
  const { favorites, removeFavorite, updateFavorite, reorderFavorites } = useFavorites();
  const { language } = settings;
  const isRtl = language === 'hebrew';
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>({ chapter: '', name: '' });

  // Tap/scroll stay responsive: pointer needs an 8px move, touch a short press.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  );

  if (favorites.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center" dir={isRtl ? 'rtl' : 'ltr'}>
        <p className="font-assistant text-sm text-muted-foreground">{t('emptyFavorites', language)}</p>
      </div>
    );
  }

  const chapter = parseChapter(draft.chapter);
  // A same chapter + same label pair is dropped by the favorites normalizer, so
  // block the save instead of losing the row on the next sync.
  const isDuplicate =
    chapter !== null &&
    favorites.some((f) => f.id !== editing && f.chapter === chapter && f.name === draft.name.trim());
  const error = chapter === null
    ? t('invalidChapter', language)
    : isDuplicate
      ? t('duplicateFavorite', language)
      : null;

  const startEdit = (fav: FavoritePerek) => {
    setEditing(fav.id);
    setDraft({ chapter: String(fav.chapter), name: fav.name });
  };
  const commitEdit = () => {
    if (!editing || chapter === null || isDuplicate) return;
    updateFavorite(editing, { chapter, name: draft.name });
    setEditing(null);
  };
  const cancelEdit = () => setEditing(null);

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const ids = favorites.map((f) => f.id);
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from < 0 || to < 0) return;
    reorderFavorites(arrayMove(ids, from, to));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={favorites.map((f) => f.id)} strategy={verticalListSortingStrategy}>
        <section className="space-y-2.5" dir={isRtl ? 'rtl' : 'ltr'}>
          {favorites.map((f) => (
            <SortableRow
              key={f.id}
              fav={f}
              settings={settings}
              onOpenChapter={onOpenChapter}
              editing={editing === f.id}
              draft={draft}
              setDraft={(updates) => setDraft((prev) => ({ ...prev, ...updates }))}
              error={error}
              startEdit={startEdit}
              commitEdit={commitEdit}
              cancelEdit={cancelEdit}
              removeFavorite={removeFavorite}
            />
          ))}
        </section>
      </SortableContext>
    </DndContext>
  );
};
