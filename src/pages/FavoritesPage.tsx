import { Link, useNavigate } from 'react-router-dom';
import { useAppSettings } from '@/components/Layout';
import { useInstanceLink } from '@/context/instance';
import { PageHeader } from '@/components/PageHeader';
import { FavoritesView } from '@/components/FavoritesView';
import { t } from '@/data/translations';
import { LayoutGrid, ChevronRight } from 'lucide-react';

const FavoritesPage = () => {
  const { settings } = useAppSettings();
  const { language } = settings;
  const isRtl = language === 'hebrew';
  const navigate = useNavigate();
  const iLink = useInstanceLink();

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <PageHeader
        language={language}
        title={t('modeFavorites', language)}
        subtitle={t('favoritesDesc', language)}
        backTo={iLink('/')}
      />

      <main className="p-4 space-y-4">
        {/* Jump to the full 1–150 grid to add more favourites */}
        <Link
          to={iLink('/perek')}
          className="w-full rounded-2xl border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors px-4 py-3 flex items-center gap-3"
        >
          <span className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
            <LayoutGrid className="w-[18px] h-[18px] text-primary" />
          </span>
          <span className={`flex-1 ${language === 'hebrew' ? 'font-david' : 'font-cormorant'} text-base`}>
            {t('browseAllTehilim', language)}
          </span>
          <ChevronRight className="w-4 h-4 text-muted-foreground/50 rtl:rotate-180 shrink-0" />
        </Link>

        <FavoritesView settings={settings} onOpenChapter={(n) => navigate(iLink(`/favorites/${n}`))} />
      </main>
    </div>
  );
};

export default FavoritesPage;
