import { useNavigate } from 'react-router-dom';
import { useAppSettings } from '@/components/Layout';
import { useInstanceLink } from '@/context/instance';
import { PageHeader } from '@/components/PageHeader';
import { NumberGrid } from '@/components/NumberGrid';
import { PrayerBlock } from '@/components/PrayerBlock';
import { prayerBefore, prayerAfterBook, prayerAfterFiveBooks } from '@/data/prayers';
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
        {/* Opening prayer ABOVE the grid */}
        <PrayerBlock title={prayerBefore.title[language]} text={prayerBefore.text} settings={settings} />

        <NumberGrid language={language} onPickChapter={(n) => navigate(iLink(`/perek/${n}`))} />

        {/* Closing prayer AFTER the grid, split in two (PDF: after a book / after the five books) */}
        <div className="space-y-2">
          <PrayerBlock title={prayerAfterBook.title[language]} text={prayerAfterBook.text} settings={settings} />
          <PrayerBlock title={prayerAfterFiveBooks.title[language]} text={prayerAfterFiveBooks.text} settings={settings} />
        </div>
      </main>
    </div>
  );
};

export default PerekListPage;
