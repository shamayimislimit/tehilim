import { ReadingSegment, TehilimSettings } from '@/types/tehilim';
import { ChapterBlock } from '@/components/ChapterBlock';
import { PrayerBlock } from '@/components/PrayerBlock';
import { prayerBefore, prayerAfter } from '@/data/prayers';
import { t } from '@/data/translations';

interface DayContinuousReaderProps {
  segments: ReadingSegment[];
  settings: TehilimSettings;
}

export const DayContinuousReader = ({ segments, settings }: DayContinuousReaderProps) => {
  const language = settings.language;
  // Distinct chapters covered today (a partial-chapter day like 119:1-96 = 1).
  const n = new Set(segments.map((s) => s.chapter)).size;
  const countLabel =
    language === 'hebrew'
      ? n === 1 ? 'פרק אחד' : `${n} פרקים`
      : language === 'french'
        ? `${n} chapitre${n > 1 ? 's' : ''}`
        : `${n} chapter${n > 1 ? 's' : ''}`;

  return (
    <div className="space-y-4">
      {/* Yehi Ratzon said before the reading */}
      <PrayerBlock title={prayerBefore.title[language]} text={prayerBefore.text} settings={settings} />

      <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] font-assistant text-muted-foreground">
        <span>{t('chaptersOfTheDay', language)}</span>
        <span>{countLabel}</span>
      </div>

      <div className="rounded-2xl border border-border bg-card/40 p-4 md:p-5 space-y-2">
        {segments.map((s, i) => (
          <ChapterBlock
            key={`${s.chapter}:${s.fromVerse ?? ''}-${s.toVerse ?? ''}-${i}`}
            chapter={s.chapter}
            fromVerse={s.fromVerse}
            toVerse={s.toVerse}
            settings={settings}
            compact
          />
        ))}
      </div>

      <p className="text-center text-xs font-assistant text-muted-foreground py-2">
        {language === 'hebrew' ? 'סיום פרקי היום' : language === 'french' ? 'Fin des chapitres du jour' : "End of today's chapters"}
      </p>

      {/* Yehi Ratzon said after the reading */}
      <PrayerBlock title={prayerAfter.title[language]} text={prayerAfter.text} settings={settings} />
    </div>
  );
};
