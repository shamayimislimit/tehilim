import { Link, useNavigate } from 'react-router-dom';
import { useAppSettings } from '@/components/Layout';
import { useInstanceLink } from '@/context/instance';
import { useAuth } from '@/context/auth';
import { useFavorites } from '@/hooks/useFavorites';
import { PageHeader } from '@/components/PageHeader';
import { FavoritesView } from '@/components/FavoritesView';
import { Button } from '@/components/ui/button';
import { t } from '@/data/translations';
import { LayoutGrid, ChevronRight, CloudOff } from 'lucide-react';

const FavoritesPage = () => {
  const { settings } = useAppSettings();
  const { language } = settings;
  const isRtl = language === 'hebrew';
  const navigate = useNavigate();
  const iLink = useInstanceLink();
  const { ready, user, setLoginOpen } = useAuth();
  const { favorites } = useFavorites();

  // Logged-out notice: adapt the message to whether favourites exist locally.
  const showLoginNotice = ready && !user;

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <PageHeader
        language={language}
        title={t('modeFavorites', language)}
        subtitle={t('favoritesDesc', language)}
        backTo={iLink('/')}
      />

      <main className="p-4 space-y-4">
        {/* Not-logged-in notice: explains favourites are local-only / how to recover them */}
        {showLoginNotice && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 flex gap-3" dir={isRtl ? 'rtl' : 'ltr'}>
            <CloudOff className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0 space-y-2">
              <p className={`${language === 'hebrew' ? 'font-david' : 'font-cormorant'} text-base leading-tight`}>
                {t('favNotLoggedTitle', language)}
              </p>
              <p className="text-sm font-assistant text-muted-foreground leading-snug">
                {favorites.length > 0 ? t('favNotLoggedHasLocal', language) : t('favNotLoggedNoLocal', language)}
              </p>
              <Button size="sm" onClick={() => setLoginOpen(true)} className="font-assistant">
                {t('loginCta', language)}
              </Button>
            </div>
          </div>
        )}

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
