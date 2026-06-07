import { TehilimSettings } from '@/types/tehilim';
import { ChapterBlock } from '@/components/ChapterBlock';
import { t } from '@/data/translations';

interface DayContinuousReaderProps {
  chapters: number[];
  settings: TehilimSettings;
}

export const DayContinuousReader = ({ chapters, settings }: DayContinuousReaderProps) => {
  const language = settings.language;
  const n = chapters.length;
  const countLabel =
    language === 'hebrew'
      ? n === 1 ? 'פרק אחד' : `${n} פרקים`
      : language === 'french'
        ? `${n} chapitre${n > 1 ? 's' : ''}`
        : `${n} chapter${n > 1 ? 's' : ''}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] font-assistant text-muted-foreground">
        <span>{t('chaptersOfTheDay', language)}</span>
        <span>{countLabel}</span>
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
