import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAppSettings } from '@/components/Layout';
import { useInstanceLink } from '@/context/instance';
import { PageHeader } from '@/components/PageHeader';
import { ChapterReader } from '@/components/ChapterReader';
import { TOTAL_CHAPTERS, getChapter } from '@/data/tehilimData';

const PerekReadingPage = () => {
  const { settings } = useAppSettings();
  const { language } = settings;
  const isRtl = language === 'hebrew';
  const navigate = useNavigate();
  const iLink = useInstanceLink();
  const { n: nParam } = useParams();
  const chapter = Number(nParam);
  const valid = Number.isInteger(chapter) && chapter >= 1 && chapter <= TOTAL_CHAPTERS;

  if (!valid) return <Navigate to={iLink('/perek')} replace />;

  const numeral = getChapter(chapter)?.chapterHebrew ?? chapter;

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      {/* The book name stays at the top; the perek number + position live in the nav. */}
      <PageHeader
        language={language}
        title="ספר תהילים"
        titleHebrew
        backTo={iLink('/perek')}
      />

      <main className="p-4">
        <ChapterReader
          chapter={chapter}
          onChange={(next) => navigate(iLink(`/perek/${next}`))}
          settings={settings}
          showStar
          label={
            <>
              <span className="block font-david text-lg leading-tight" dir="rtl">פרק {numeral}</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] font-assistant text-muted-foreground" dir="ltr">
                {chapter} / {TOTAL_CHAPTERS}
              </span>
            </>
          }
        />
      </main>
    </div>
  );
};

export default PerekReadingPage;
