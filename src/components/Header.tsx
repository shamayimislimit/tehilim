import { Language } from '@/types/tehilim';
import { useInstance } from '@/context/instance';
import { t } from '@/data/translations';

interface HeaderProps {
  language: Language;
  subtitle?: string;
}

export const Header = ({ language, subtitle }: HeaderProps) => {
  const instance = useInstance();
  const isRtl = language === 'hebrew';
  const title = instance.title[language];
  const dedication = instance.dedication[language];
  const portrait = instance.portrait;

  return (
    <header className="relative">
      {/* בס״ד is always pinned top-right (physical), every language — the chrome
          controls (account + settings) sit top-left, opposite it. */}
      <div className="absolute top-5 right-5 z-10">
        <span className="text-xs font-frank text-muted-foreground/70 tracking-wide">בס&quot;ד</span>
      </div>

      <div className="text-center pt-14 pb-6 px-4" dir={isRtl ? 'rtl' : 'ltr'}>
        {portrait ? (
          <img
            src={portrait}
            alt={dedication}
            className="mx-auto mb-5 h-28 w-28 md:h-32 md:w-32 rounded-full object-cover ring-2 ring-primary/30 shadow-[var(--shadow-soft)]"
          />
        ) : null}

        <h1
          className={
            language === 'hebrew'
              ? 'font-david text-4xl md:text-5xl font-medium tracking-tight text-foreground'
              : 'font-cormorant text-4xl md:text-5xl font-light tracking-wide text-foreground'
          }
        >
          {title}
        </h1>

        <div className="my-4 flex items-center justify-center">
          <div className="h-px w-16 bg-primary/40" />
        </div>

        <p
          className={
            language === 'hebrew'
              ? 'font-david text-lg md:text-xl text-foreground/85 leading-snug'
              : 'font-cormorant italic text-lg md:text-xl font-light text-foreground/80 tracking-wide leading-snug'
          }
        >
          {dedication}
        </p>

        {subtitle ? (
          <p className="mt-4 text-xs uppercase tracking-[0.2em] font-assistant text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
      </div>
    </header>
  );
};
