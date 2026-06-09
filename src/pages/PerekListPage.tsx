import { useNavigate } from 'react-router-dom';
import { useAppSettings } from '@/components/Layout';
import { useInstanceLink } from '@/context/instance';
import { PageHeader } from '@/components/PageHeader';
import { NumberGrid } from '@/components/NumberGrid';
import { t } from '@/data/translations';

const PerekListPage = () => {
  const { settings } = useAppSettings();
  const { language } = settings;
  const isRtl = language === 'hebrew';
  const navigate = useNavigate();
  const iLink = useInstanceLink();

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <PageHeader
        language={language}
        title={t('modeNumber', language)}
        subtitle={t('numberDesc', language)}
        backTo={iLink('/')}
      />

      <main className="p-4 space-y-4">
        <NumberGrid language={language} onPickChapter={(n) => navigate(iLink(`/perek/${n}`))} />
      </main>
    </div>
  );
};

export default PerekListPage;
