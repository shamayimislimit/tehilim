import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ChevronRight } from 'lucide-react';
import { useAppSettings } from '@/components/Layout';
import { useInstanceLink } from '@/context/instance';
import { PageHeader } from '@/components/PageHeader';
import { getBooksSchedule, getChapter } from '@/data/tehilimData';
import { toHebrewNumeral } from '@/lib/hebrewNumeral';
import { t, bookTitle } from '@/data/translations';
import { cn } from '@/lib/utils';

/** Picker for the 5 books of Tehilim; each opens the continuous reader for that book. */
const BooksPage = () => {
  const { settings } = useAppSettings();
  const { language, bookmarkChapter } = settings;
  const isRtl = language === 'hebrew';
  const iLink = useInstanceLink();
  const books = useMemo(() => getBooksSchedule(), []);

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <PageHeader language={language} title={t('modeBooks', language)} subtitle={t('booksDesc', language)} backTo={iLink('/')} />

      <main className="p-4 space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] font-assistant text-muted-foreground text-center">
          {t('chooseBook', language)}
        </p>
        {books.map((b) => {
          const first = b.chapters[0];
          const last = b.chapters[b.chapters.length - 1];
          const hasBookmark = bookmarkChapter != null && b.chapters.includes(bookmarkChapter);
          return (
            <Link
              key={b.index}
              to={iLink(`/books/${b.index}`)}
              className={cn(
                'group rounded-2xl border bg-card/60 p-4 flex items-center gap-3.5 hover:border-primary/40 hover:bg-card/80 transition-all',
                hasBookmark ? 'border-primary/60' : 'border-border'
              )}
            >
              <span className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 font-david text-lg text-primary">
                {toHebrewNumeral(b.index)}
              </span>
              <span className="flex-1 min-w-0">
                <span className={cn('block leading-tight text-lg', isRtl ? 'font-david' : 'font-cormorant')}>
                  {bookTitle(b.index, language)}
                </span>
                <span className="block text-xs font-assistant text-muted-foreground">
                  <span dir="rtl">פרק {getChapter(first)?.chapterHebrew} – {getChapter(last)?.chapterHebrew}</span>
                  {' · '}
                  <span dir="ltr">{first}–{last}</span>
                  {' · '}
                  {b.chapters.length} {t('chaptersCount', language)}
                </span>
              </span>
              {hasBookmark && <Bookmark className="w-4 h-4 text-primary shrink-0" fill="currentColor" aria-label={t('bookmark', language)} />}
              <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary/60 transition-colors rtl:rotate-180 shrink-0" />
            </Link>
          );
        })}
      </main>
    </div>
  );
};

export default BooksPage;
