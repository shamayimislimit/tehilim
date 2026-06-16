import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Language } from '@/types/tehilim';
import { t } from '@/data/translations';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  language: Language;
  title: string;
  subtitle?: ReactNode;
  backTo: string;
  /** When set, the back control runs this instead of navigating to `backTo`
      (e.g. go back in history to wherever the user came from). */
  onBack?: () => void;
  /** Force the Hebrew prayer font for the title even in FR/EN (e.g. "פרק קכ״א"). */
  titleHebrew?: boolean;
}

/** Compact sticky header used on inner pages (picker / reading / favorites). */
export const PageHeader = ({ language, title, subtitle, backTo, onBack, titleHebrew = false }: PageHeaderProps) => {
  const isRtl = language === 'hebrew';
  const backClass =
    'absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-assistant text-muted-foreground hover:text-foreground transition-colors px-1.5 py-1 rounded-md';

  return (
    <div
      className="sticky z-20 bg-background/85 backdrop-blur-sm border-b border-border/60"
      style={{ top: 'var(--banner-h, 0px)' }}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Back button is pinned physical-right (opposite the top-left controls),
          every language; title stays centered via symmetric padding. */}
      <div className="relative flex items-center px-3 py-2.5 min-h-[44px]">
        {onBack ? (
          <button type="button" onClick={onBack} className={backClass}>
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{t('back', language)}</span>
          </button>
        ) : (
          <Link to={backTo} className={backClass}>
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{t('back', language)}</span>
          </Link>
        )}

        <div className="flex-1 min-w-0 text-center px-16">
          <p
            className={
              titleHebrew || language === 'hebrew'
                ? 'font-david text-lg leading-tight truncate'
                : 'font-cormorant text-lg leading-tight truncate'
            }
            dir={titleHebrew ? 'rtl' : undefined}
          >
            {title}
          </p>
          {subtitle ? (
            <p className="text-[10px] uppercase tracking-[0.18em] font-assistant text-muted-foreground truncate">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};
