import { useNavigate } from 'react-router-dom';
import { useAppSettings } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { FavoritesView } from '@/components/FavoritesView';
import { t } from '@/data/translations';

const FavoritesPage = () => {
  const { settings } = useAppSettings();
  const { language } = settings;
  const isRtl = language === 'hebrew';
  const navigate = useNavigate();

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <PageHeader
        language={language}
        title={t('modeFavorites', language)}
        subtitle={t('favoritesDesc', language)}
        backTo="/"
      />

      <main className="p-4">
        <FavoritesView settings={settings} onOpenChapter={(n) => navigate(`/perek/${n}`)} />
      </main>
    </div>
  );
};

export default FavoritesPage;
