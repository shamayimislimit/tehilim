import { TehilimSettings } from '@/types/tehilim';
import { ChapterBlock } from '@/components/ChapterBlock';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getChapter } from '@/data/tehilimData';

interface ChapterReaderProps {
  chapter: number;
  onChange: (next: number) => void;
  settings: TehilimSettings;
}

export const ChapterReader = ({ chapter, onChange, settings }: ChapterReaderProps) => (
  <article className="space-y-6">
    {/* Follows reading direction: in RTL "previous" sits on the right, arrows mirrored */}
    <div className="flex items-center justify-between gap-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => chapter > 1 && onChange(chapter - 1)}
        disabled={chapter <= 1}
        className="font-assistant"
      >
        <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
      </Button>
      <span className="flex flex-col items-center gap-1">
        <span className="font-david text-xl leading-none" dir="rtl">{getChapter(chapter)?.chapterHebrew}</span>
        <span className="text-[10px] uppercase tracking-[0.18em] font-assistant text-muted-foreground leading-none" dir="ltr">
          {chapter} / 150
        </span>
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => chapter < 150 && onChange(chapter + 1)}
        disabled={chapter >= 150}
        className="font-assistant"
      >
        <ChevronRight className="w-4 h-4 rtl:rotate-180" />
      </Button>
    </div>

    <ChapterBlock chapter={chapter} settings={settings} />
  </article>
);
