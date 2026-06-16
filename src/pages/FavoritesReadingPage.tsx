import { useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAppSettings } from '@/components/Layout';
import { useInstanceLink } from '@/context/instance';
import { PageHeader } from '@/components/PageHeader';
import { ChapterReader } from '@/components/ChapterReader';
import { useFavorites } from '@/hooks/useFavorites';
import { getChapter } from '@/data/tehilimData';

/**
 * Reads a favourited chapter, but prev/next walk the FAVOURITES list (in display
 * order) rather than the global 1..150 sequence. Arrows are disabled at the ends.
 */
const FavoritesReadingPage = () => {
  const { settings } = useAppSettings();
  const { language } = settings;
  const isRtl = language === 'hebrew';
  const navigate = useNavigate();
  const iLink = useInstanceLink();
  const { favorites } = useFavorites();
  const { n: nParam } = useParams();
  const chapter = Number(nParam);

  // Ordered, de-duplicated chapter sequence as shown in the favourites list.
  const sequence = useMemo(() => {
    const seen = new Set<number>();
    const out: number[] = [];
    for (const f of favorites) {
      if (!seen.has(f.chapter)) { seen.add(f.chapter); out.push(f.chapter); }
    }
    return out;
  }, [favorites]);

  const valid = Number.isInteger(chapter) && chapter >= 1 && chapter <= 150;
  if (!valid) return <Navigate to={iLink('/favorites')} replace />;
  // Nothing favourited (e.g. opened by direct URL) → back to the list.
  if (favorites.length === 0) return <Navigate to={iLink('/favorites')} replace />;

  const idx = sequence.indexOf(chapter);
  const prevTarget = idx > 0 ? sequence[idx - 1] : null;
  const nextTarget = idx >= 0 && idx < sequence.length - 1 ? sequence[idx + 1] : null;

  // Top header = the user's label, or the default "פרק <heb>" when unnamed.
  const fav = favorites.find((f) => f.chapter === chapter);
  const chap = getChapter(chapter);
  const numeral = chap?.chapterHebrew ?? chapter;
  const title = fav?.name || `פרק ${numeral}`;

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <PageHeader
        language={language}
        title={title}
        titleHebrew={!fav?.name}
        backTo={iLink('/favorites')}
      />

      <main className="p-4">
        {/* Nav bar shows the perek + position within the favourites list; the star
            sits at the right of the bar, exactly like the by-number reader. */}
        <ChapterReader
          chapter={chapter}
          onChange={(next) => navigate(iLink(`/favorites/${next}`))}
          settings={settings}
          prevTarget={prevTarget}
          nextTarget={nextTarget}
          showStar
          label={
            <>
              <span className="block font-david text-lg leading-tight" dir="rtl">פרק {numeral}</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] font-assistant text-muted-foreground" dir="ltr">
                {idx + 1} / {sequence.length}
              </span>
            </>
          }
        />
      </main>
    </div>
  );
};

export default FavoritesReadingPage;
