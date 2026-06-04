import { useEffect, useRef } from 'react';
import { TehilimSettings } from '@/types/tehilim';
import { ChapterBlock } from '@/components/ChapterBlock';
import { t } from '@/data/translations';

interface DayContinuousReaderProps {
  chapters: number[];
  settings: TehilimSettings;
  /** Bumped when the selected day changes, to scroll the reader into view. */
  scrollKey: string | number;
}

export const DayContinuousReader = ({ chapters, settings, scrollKey }: DayContinuousReaderProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollKey]);

  const language = settings.language;

  return (
    <div ref={ref} className="space-y-4">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] font-assistant text-muted-foreground">
        <span>{t('chaptersOfTheDay', language)}</span>
        <span dir="ltr">{chapters.length} {t('chapter', language)}{chapters.length > 1 ? 's' : ''}</span>
      </div>

      <div className="rounded-2xl border border-border bg-card/40 p-4 md:p-5 space-y-2">
        {chapters.map((c) => (
          <ChapterBlock key={c} chapter={c} settings={settings} compact />
        ))}
      </div>

      <p className="text-center text-xs font-assistant text-muted-foreground py-4">
        {language === 'hebrew' ? 'סיום פרקי היום' : language === 'french' ? 'Fin des chapitres du jour' : "End of today's chapters"}
      </p>
    </div>
  );
};
