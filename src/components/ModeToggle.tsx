import { Language, ReadMode } from '@/types/tehilim';
import { t } from '@/data/translations';
import { cn } from '@/lib/utils';
import { CalendarDays, CalendarRange, Hash, Star } from 'lucide-react';

interface ModeToggleProps {
  mode: ReadMode;
  onModeChange: (mode: ReadMode) => void;
  language: Language;
}

const modes: { value: ReadMode; labelKey: 'modeWeek' | 'modeMonth' | 'modeNumber' | 'modeFavorites'; Icon: typeof CalendarDays }[] = [
  { value: 'week', labelKey: 'modeWeek', Icon: CalendarDays },
  { value: 'month', labelKey: 'modeMonth', Icon: CalendarRange },
  { value: 'number', labelKey: 'modeNumber', Icon: Hash },
  { value: 'favorites', labelKey: 'modeFavorites', Icon: Star },
];

export const ModeToggle = ({ mode, onModeChange, language }: ModeToggleProps) => (
  <div className="flex justify-center px-4">
    <div
      role="radiogroup"
      aria-label="Reading mode"
      className="inline-flex items-center gap-1 rounded-full border border-border bg-card/70 backdrop-blur-sm p-1 shadow-[var(--shadow-soft)]"
    >
      {modes.map(({ value, labelKey, Icon }) => {
        const active = mode === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onModeChange(value)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-assistant rounded-full transition-colors duration-200 tracking-wide',
              active
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{t(labelKey, language)}</span>
          </button>
        );
      })}
    </div>
  </div>
);
