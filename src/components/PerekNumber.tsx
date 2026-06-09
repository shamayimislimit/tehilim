import { getChapter } from '@/data/tehilimData';
import { cn } from '@/lib/utils';

interface PerekNumberProps {
  chapter: number;
  className?: string;
  /** Classes for the Hebrew numeral (size/font). */
  hebrewClass?: string;
  /** Classes for the small Arabic digit underneath. */
  digitClass?: string;
}

/**
 * Perek number rendered like the month-grid cells: Hebrew numeral on top,
 * Arabic digit in small underneath — used everywhere a perek number is shown.
 */
export const PerekNumber = ({ chapter, className, hebrewClass, digitClass }: PerekNumberProps) => {
  const hebrew = getChapter(chapter)?.chapterHebrew ?? String(chapter);

  return (
    <span className={cn('inline-flex flex-col items-center gap-0.5', className)}>
      <span className={cn('font-frank leading-none', hebrewClass)} dir="rtl">
        {hebrew}
      </span>
      <span className={cn('font-assistant text-[9px] leading-none text-muted-foreground', digitClass)} dir="ltr">
        {chapter}
      </span>
    </span>
  );
};
