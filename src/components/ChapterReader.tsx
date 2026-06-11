import { TehilimSettings } from '@/types/tehilim';
import { ChapterBlock } from '@/components/ChapterBlock';
import { PrayerBlock } from '@/components/PrayerBlock';
import { SectionClosing } from '@/components/SectionClosing';
import { prayerBefore } from '@/data/prayers';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getChapter } from '@/data/tehilimData';

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
  /** Overrides the default "{chapter} / 150" position line. */
  positionLabel?: string;
}

export const ChapterReader = ({
  chapter,
  onChange,
  settings,
  prevTarget,
  nextTarget,
  positionLabel,
}: ChapterReaderProps) => {
  const usingTargets = prevTarget !== undefined || nextTarget !== undefined;
  const goPrev = usingTargets ? prevTarget ?? null : chapter > 1 ? chapter - 1 : null;
  const goNext = usingTargets ? nextTarget ?? null : chapter < 150 ? chapter + 1 : null;

  return (
    <article className="space-y-6">
      {/* Follows reading direction: in RTL "previous" sits on the right, arrows mirrored */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => goPrev != null && onChange(goPrev)}
          disabled={goPrev == null}
          className="font-assistant"
        >
          <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
        </Button>
        <span className="flex flex-col items-center gap-1">
          <span className="font-david text-xl leading-none" dir="rtl">{getChapter(chapter)?.chapterHebrew}</span>
          <span className="text-[10px] uppercase tracking-[0.18em] font-assistant text-muted-foreground leading-none" dir="ltr">
            {positionLabel ?? `${chapter} / 150`}
          </span>
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => goNext != null && onChange(goNext)}
          disabled={goNext == null}
          className="font-assistant"
        >
          <ChevronRight className="w-4 h-4 rtl:rotate-180" />
        </Button>
      </div>

      {/* Opening Yehi Ratzon — shown in every reading section */}
      <PrayerBlock title={prayerBefore.title[settings.language]} text={prayerBefore.text} settings={settings} />

      <ChapterBlock chapter={chapter} settings={settings} />

      {/* Concluding verses (book Yehi Ratzon renders inline in ChapterBlock) */}
      <SectionClosing settings={settings} />
    </article>
  );
};
