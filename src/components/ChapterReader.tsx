import { TehilimSettings } from '@/types/tehilim';
import { ChapterBlock } from '@/components/ChapterBlock';
import { Button } from '@/components/ui/button';
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
}

export const ChapterReader = ({ chapter, onChange, settings, prevTarget, nextTarget }: ChapterReaderProps) => {
  const usingTargets = prevTarget !== undefined || nextTarget !== undefined;
  const goPrev = usingTargets ? prevTarget ?? null : chapter > 1 ? chapter - 1 : null;
  const goNext = usingTargets ? nextTarget ?? null : chapter < 150 ? chapter + 1 : null;

  return (
    <article className="space-y-4">
      {/* Prev / next only — the chapter + position are shown once in the page
          header (no duplicate label here). Arrows follow reading direction. */}
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => goPrev != null && onChange(goPrev)} disabled={goPrev == null} className="font-assistant gap-1">
          <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => goNext != null && onChange(goNext)} disabled={goNext == null} className="font-assistant gap-1">
          <ChevronRight className="w-4 h-4 rtl:rotate-180" />
        </Button>
      </div>

      <ChapterBlock chapter={chapter} settings={settings} hideTitle />
    </article>
  );
};
