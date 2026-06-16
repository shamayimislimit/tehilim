import { useRef, type ReactNode } from 'react';
import { TehilimSettings } from '@/types/tehilim';
import { ChapterBlock } from '@/components/ChapterBlock';
import { FavoriteToggle } from '@/components/FavoriteToggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ChapterReaderProps {
  chapter: number;
  onChange: (next: number) => void;
  settings: TehilimSettings;
  /**
   * Explicit navigation targets. When provided (e.g. favorites mode), prev/next
   * jump to these chapters and an arrow is disabled when its target is null.
   * Left undefined, the reader walks the global 1..150 sequence.
   */
  prevTarget?: number | null;
  nextTarget?: number | null;
  /** Centered label between the arrows (e.g. "פרק כ״ד" + "24 / 150"). When set,
      arrows flank it; otherwise prev/next sit at the row's edges (favorites). */
  label?: ReactNode;
  /** Show the favourite star at the right of the nav bar (and hide ChapterBlock's). */
  showStar?: boolean;
}

export const ChapterReader = ({ chapter, onChange, settings, prevTarget, nextTarget, label, showStar = false }: ChapterReaderProps) => {
  const usingTargets = prevTarget !== undefined || nextTarget !== undefined;
  const goPrev = usingTargets ? prevTarget ?? null : chapter > 1 ? chapter - 1 : null;
  const goNext = usingTargets ? nextTarget ?? null : chapter < 150 ? chapter + 1 : null;

  // Horizontal swipe to flip chapters. Swipe left → next, swipe right → prev
  // (matches the on-screen arrow placement in RTL). Vertical scroll untouched.
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = touchStart.current;
    touchStart.current = null;
    if (!s) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    // Require a clear horizontal gesture so it never fights with scrolling.
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx < 0) { if (goNext != null) onChange(goNext); }
    else { if (goPrev != null) onChange(goPrev); }
  };

  return (
    <article className="space-y-4" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {/* With a label: arrows flank the centered "פרק / position", favourite star
          pinned physical-right. Without: prev/next at the edges (favorites reader). */}
      <div className={cn('relative flex items-center min-h-[2.75rem]', label ? 'justify-center gap-4' : 'justify-between gap-3')}>
        <Button variant="ghost" size="sm" onClick={() => goPrev != null && onChange(goPrev)} disabled={goPrev == null} className="font-assistant gap-1">
          <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
        </Button>

        {label && <div className="text-center leading-tight select-none">{label}</div>}

        <Button variant="ghost" size="sm" onClick={() => goNext != null && onChange(goNext)} disabled={goNext == null} className="font-assistant gap-1">
          <ChevronRight className="w-4 h-4 rtl:rotate-180" />
        </Button>

        {showStar && (
          <FavoriteToggle
            chapter={chapter}
            language={settings.language}
            className="absolute right-0 top-1/2 -translate-y-1/2"
          />
        )}
      </div>

      <ChapterBlock chapter={chapter} settings={settings} hideTitle hideStar={showStar} />
    </article>
  );
};
