import { useReadingProgress } from '@/hooks/useReadingProgress';
import { Language } from '@/types/tehilim';
import { t } from '@/data/translations';
import { TOTAL_CHAPTERS } from '@/data/tehilimData';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface FooterProps {
  language: Language;
}

export const Footer = ({ language }: FooterProps) => {
  const { progress, reset } = useReadingProgress();
  const count = progress.read.length;
  const pct = Math.round((count / TOTAL_CHAPTERS) * 100);
  const isRtl = language === 'hebrew';

  return (
    <footer className="mt-12 border-t border-border/60 pt-6 pb-24 px-2 space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-assistant text-muted-foreground uppercase tracking-wider">
          <span>{t('progress', language)}</span>
          <span dir="ltr">{count} / {TOTAL_CHAPTERS} · {pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {count > 0 && (
        <div className="flex justify-center">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              if (confirm(t('resetProgress', language) + ' ?')) reset();
            }}
            className="gap-1.5 text-muted-foreground hover:text-destructive font-assistant text-xs"
          >
            <RotateCcw className="w-3 h-3" />
            {t('resetProgress', language)}
          </Button>
        </div>
      )}
    </footer>
  );
};
