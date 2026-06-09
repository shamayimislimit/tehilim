import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAppSettings } from '@/components/Layout';
import { useInstanceLink } from '@/context/instance';
import { PageHeader } from '@/components/PageHeader';
import { ChapterReader } from '@/components/ChapterReader';
import { TOTAL_CHAPTERS, getChapter } from '@/data/tehilimData';
import { t } from '@/data/translations';

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

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Hebrew numeral as title, Arabic digit small underneath */}
      <PageHeader
        language={language}
        title={`פרק ${getChapter(chapter)?.chapterHebrew ?? chapter}`}
        titleHebrew
        subtitle={`${t('chapter', language)} ${chapter} / ${TOTAL_CHAPTERS}`}
        backTo={iLink('/perek')}
      />

      <main className="p-4">
        <ChapterReader
          chapter={chapter}
          onChange={(next) => navigate(iLink(`/perek/${next}`))}
          settings={settings}
        />
      </main>
    </div>
  );
};

export default PerekReadingPage;
