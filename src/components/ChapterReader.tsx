import { TehilimSettings } from '@/types/tehilim';
import { ChapterBlock } from '@/components/ChapterBlock';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { t } from '@/data/translations';

interface ChapterReaderProps {
  chapter: number;
  onChange: (next: number) => void;
  settings: TehilimSettings;
}

export const ChapterReader = ({ chapter, onChange, settings }: ChapterReaderProps) => (
  <article className="space-y-6">
    <div className="flex items-center justify-between gap-3" dir="ltr">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => chapter > 1 && onChange(chapter - 1)}
        disabled={chapter <= 1}
        className="font-assistant"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <span className="text-xs uppercase tracking-[0.18em] font-assistant text-muted-foreground">
        {t('chapter', settings.language)} {chapter} / 150
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => chapter < 150 && onChange(chapter + 1)}
        disabled={chapter >= 150}
        className="font-assistant"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>

    <ChapterBlock chapter={chapter} settings={settings} />
  </article>
);
