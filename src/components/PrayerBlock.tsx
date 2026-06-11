import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { PrayerFont, TehilimSettings } from '@/types/tehilim';
import { transformVerse } from '@/lib/textUtils';
import { cn } from '@/lib/utils';

const FONT_CLASS: Record<PrayerFont, string> = {
  frank: 'font-frank',
  david: 'font-david',
  assistant: 'font-assistant',
};

interface PrayerBlockProps {
  title: string;
  text: string; // paragraphs separated by blank lines
  settings: TehilimSettings;
  defaultOpen?: boolean;
}

/** Collapsible prayer (Yehi Ratzon before / after Tehilim), styled like the app. */
export const PrayerBlock = ({ title, text, settings, defaultOpen = false }: PrayerBlockProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const { prayerFont, fontSize, showCantillation, showNikkud } = settings;
  const fontClass = FONT_CLASS[prayerFont] ?? FONT_CLASS.frank;
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => transformVerse(p.trim(), showCantillation, showNikkud))
    .filter(Boolean);

  return (
    <div className="rounded-2xl border border-primary/25 bg-primary/[0.04] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-start hover:bg-primary/[0.06] transition-colors"
        dir="rtl"
      >
        <span className="font-david text-lg text-foreground leading-tight">{title}</span>
        <ChevronDown className={cn('w-4 h-4 shrink-0 text-primary transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          dir="rtl"
          className={cn('px-4 pb-4 pt-1 space-y-3', fontClass)}
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.9 }}
        >
          {paragraphs.map((p, i) => (
            <p key={i} className="text-right text-foreground">{p}</p>
          ))}
        </div>
      )}
    </div>
  );
};
