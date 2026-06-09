import { Link } from 'react-router-dom';
import { Language } from '@/types/tehilim';
import { t } from '@/data/translations';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  language: Language;
  title: string;
  subtitle?: string;
  backTo: string;
  /** Force the Hebrew prayer font for the title even in FR/EN (e.g. "פרק קכ״א"). */
  titleHebrew?: boolean;
}

/** Compact sticky header used on inner pages (picker / reading / favorites). */
export const PageHeader = ({ language, title, subtitle, backTo, titleHebrew = false }: PageHeaderProps) => {
  const isRtl = language === 'hebrew';

  return (
    <div
      className="sticky top-0 z-20 bg-background/85 backdrop-blur-sm border-b border-border/60"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center gap-2 px-3 py-2.5">
        <Link
          to={backTo}
          className="flex items-center gap-1 text-xs font-assistant text-muted-foreground hover:text-foreground transition-colors shrink-0 px-1.5 py-1 rounded-md"
        >
          <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{t('back', language)}</span>
        </Link>

        <div className="flex-1 min-w-0 text-center">
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

        {/* spacer to keep the title visually centered */}
        <div className="w-14 shrink-0" aria-hidden />
      </div>
    </div>
  );
};
