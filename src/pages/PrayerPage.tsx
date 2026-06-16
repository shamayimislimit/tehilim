import { Navigate, useParams } from 'react-router-dom';
import { useAppSettings } from '@/components/Layout';
import { useInstanceLink } from '@/context/instance';
import { PageHeader } from '@/components/PageHeader';
import { PrayerBlock } from '@/components/PrayerBlock';
import { prayerBefore, prayerAfter } from '@/data/prayers';

/** Dedicated page for the Yehi Ratzon prayers (before / after the reading). */
const PrayerPage = () => {
  const { settings } = useAppSettings();
  const { language } = settings;
  const isRtl = language === 'hebrew';
  const iLink = useInstanceLink();
  const { which } = useParams();

  const prayer = which === 'before' ? prayerBefore : which === 'after' ? prayerAfter : null;
  if (!prayer) return <Navigate to={iLink('/')} replace />;

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <PageHeader
        language={language}
        title={prayer.title[language]}
        titleHebrew
        backTo={iLink('/')}
      />

      <main className="p-4">
        <div className="rounded-2xl border border-primary/25 bg-primary/[0.04] px-4 py-4">
          <PrayerBlock title={prayer.title[language]} text={prayer.text} settings={settings} flat />
        </div>
      </main>
    </div>
  );
};

export default PrayerPage;
