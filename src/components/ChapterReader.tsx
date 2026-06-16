import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
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

const SWIPE_THRESHOLD = 60; // px to commit a chapter change
const SLIDE_MS = 220;       // slide-out / slide-in duration

export const ChapterReader = ({ chapter, onChange, settings, prevTarget, nextTarget, label, showStar = false }: ChapterReaderProps) => {
  const usingTargets = prevTarget !== undefined || nextTarget !== undefined;
  const goPrev = usingTargets ? prevTarget ?? null : chapter > 1 ? chapter - 1 : null;
  const goNext = usingTargets ? nextTarget ?? null : chapter < 150 ? chapter + 1 : null;

  // Horizontal swipe with a follow-the-finger slide. Swipe RIGHT → next,
  // swipe LEFT → prev, and the text physically slides in the swipe direction.
  const clipRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const axisRef = useRef<'h' | 'v' | null>(null);
  const lastDirRef = useRef(0); // +1 = swiped right, -1 = swiped left (drives the enter slide)
  const [offset, setOffset] = useState(0);
  const [animate, setAnimate] = useState(false);

  const width = () => clipRef.current?.offsetWidth ?? window.innerWidth;

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    startRef.current = { x: t.clientX, y: t.clientY };
    axisRef.current = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const s = startRef.current;
    if (!s) return;
    const t = e.touches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (axisRef.current == null) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      axisRef.current = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
    }
    if (axisRef.current !== 'h') return;
    // Add resistance when there's nothing to navigate to in that direction.
    const hasTarget = dx > 0 ? goNext != null : goPrev != null;
    setAnimate(false);
    setOffset(hasTarget ? dx : dx * 0.25);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const s = startRef.current;
    const axis = axisRef.current;
    startRef.current = null;
    axisRef.current = null;
    if (!s || axis !== 'h') return;
    const dx = e.changedTouches[0].clientX - s.x;
    const dir = dx > 0 ? 1 : -1;
    const target = dir > 0 ? goNext : goPrev; // right → next, left → prev
    setAnimate(true);
    if (Math.abs(dx) >= SWIPE_THRESHOLD && target != null) {
      lastDirRef.current = dir;
      setOffset(dir * width()); // current slides out in the swipe direction
      window.setTimeout(() => onChange(target), SLIDE_MS - 20);
    } else {
      setOffset(0); // snap back
    }
  };

  // When the chapter changes from a committed swipe, bring the new text in from
  // the opposite side so the whole strip travels in the swipe direction.
  useLayoutEffect(() => {
    if (lastDirRef.current === 0) return;
    const dir = lastDirRef.current;
    lastDirRef.current = 0;
    setAnimate(false);
    setOffset(-dir * width());
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setAnimate(true);
        setOffset(0);
      })
    );
    return () => cancelAnimationFrame(id);
  }, [chapter]);

  return (
    <article className="space-y-4 touch-pan-y" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
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

      {/* Clip so the sliding text never bleeds sideways; vertical scroll stays native. */}
      <div ref={clipRef} className="overflow-hidden">
        <div
          style={{
            transform: `translate3d(${offset}px, 0, 0)`,
            transition: animate ? `transform ${SLIDE_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1)` : 'none',
          }}
        >
          <ChapterBlock chapter={chapter} settings={settings} hideTitle hideStar={showStar} />
        </div>
      </div>
    </article>
  );
};
