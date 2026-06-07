import { Link, useNavigate } from 'react-router-dom';
import { useAppSettings } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { NumberGrid } from '@/components/NumberGrid';
import { t } from '@/data/translations';
import { Button } from '@/components/ui/button';

const PerekListPage = () => {
  const { settings } = useAppSettings();
  const { language, lastReadChapter } = settings;
  const isRtl = language === 'hebrew';
  const navigate = useNavigate();

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <PageHeader
        language={language}
        title={t('modeNumber', language)}
        subtitle={t('numberDesc', language)}
        backTo="/"
      />

      <main className="p-4 space-y-4">
        {lastReadChapter > 0 && (
          <div className="rounded-2xl border border-border bg-card/40 p-3 flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.18em] font-assistant text-muted-foreground">
              {t('continueReading', language)}
            </p>
            <Button size="sm" asChild className="font-assistant">
              <Link to={`/perek/${lastReadChapter}`}>
                {t('chapter', language)} {lastReadChapter}
              </Link>
            </Button>
          </div>
        )}

        <NumberGrid language={language} onPickChapter={(n) => navigate(`/perek/${n}`)} />
      </main>
    </div>
  );
};

export default PerekListPage;
