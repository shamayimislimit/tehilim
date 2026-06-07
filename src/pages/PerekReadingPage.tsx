import { useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAppSettings } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { ChapterReader } from '@/components/ChapterReader';
import { TOTAL_CHAPTERS } from '@/data/tehilimData';
import { t } from '@/data/translations';

const PerekReadingPage = () => {
  const { settings, updateSettings } = useAppSettings();
  const { language } = settings;
  const isRtl = language === 'hebrew';
  const navigate = useNavigate();
  const { n: nParam } = useParams();
  const chapter = Number(nParam);
  const valid = Number.isInteger(chapter) && chapter >= 1 && chapter <= TOTAL_CHAPTERS;

  // Remember the last opened chapter for the "continue" shortcut
  useEffect(() => {
    if (valid && settings.lastReadChapter !== chapter) {
      updateSettings({ lastReadChapter: chapter });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter, valid]);

  if (!valid) return <Navigate to="/perek" replace />;

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <PageHeader
        language={language}
        title={`${t('chapter', language)} ${chapter}`}
        subtitle={`${chapter} / ${TOTAL_CHAPTERS}`}
        backTo="/perek"
      />

      <main className="p-4">
        <ChapterReader
          chapter={chapter}
          onChange={(next) => navigate(`/perek/${next}`)}
          settings={settings}
        />
      </main>
    </div>
  );
};

export default PerekReadingPage;
