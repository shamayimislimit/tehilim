import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import { ModeToggle } from '@/components/ModeToggle';
import { SettingsToolbar } from '@/components/SettingsToolbar';
import { ChapterReader } from '@/components/ChapterReader';
import { DaySelector } from '@/components/DaySelector';
import { NumberGrid } from '@/components/NumberGrid';
import { FavoritesView } from '@/components/FavoritesView';
import { Footer } from '@/components/Footer';
import { useTehilimSettings } from '@/hooks/useTehilimSettings';
import { getMonthlySchedule, getWeeklySchedule } from '@/data/tehilimData';
import { t } from '@/data/translations';
import { ReadMode } from '@/types/tehilim';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const todayWeekday = () => new Date().getDay() + 1;
const todayMonthDay = () => Math.min(new Date().getDate(), 30);

const Index = () => {
  const { settings, updateSettings } = useTehilimSettings();
  const { language, mode, lastReadChapter } = settings;

  const [weekDay, setWeekDay] = useState(todayWeekday);
  const [monthDay, setMonthDay] = useState(todayMonthDay);
  const [chapterOpen, setChapterOpen] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      (window as any).deferredPrompt = e;
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const setMode = (m: ReadMode) => {
    updateSettings({ mode: m });
    setChapterOpen(null);
  };

  const openChapter = (n: number) => {
    setChapterOpen(n);
    updateSettings({ lastReadChapter: n });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const subtitle = useMemo(() => {
    if (chapterOpen) return `${t('chapter', language)} ${chapterOpen}`;
    if (mode === 'week') {
      const sched = getWeeklySchedule().find((d) => d.index === weekDay);
      return sched ? `${t('day', language)} ${weekDay} · ${sched.range}` : '';
    }
    if (mode === 'month') {
      const sched = getMonthlySchedule().find((d) => d.index === monthDay);
      return sched ? `${t('day', language)} ${monthDay} · ${sched.range}` : '';
    }
    if (mode === 'favorites') return t('favorites', language);
    return '';
  }, [mode, weekDay, monthDay, chapterOpen, language]);

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-[var(--gradient-wedding)] -z-10" />
      <div className="fixed inset-0 bg-[var(--gradient-overlay)] -z-10" />

      <SettingsToolbar settings={settings} onUpdate={updateSettings} />

      <div className="max-w-3xl mx-auto">
        <Header language={language} subtitle={subtitle} />

        <div className="sticky top-0 z-20 py-3 bg-background/85 backdrop-blur-sm border-b border-border/60">
          <ModeToggle mode={mode} onModeChange={setMode} language={language} />
        </div>

        <main className="p-4 space-y-6">
          {chapterOpen ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setChapterOpen(null)}
                className="gap-1.5 font-assistant text-muted-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                {language === 'hebrew' ? 'חזרה' : language === 'french' ? 'Retour' : 'Back'}
              </Button>
              <ChapterReader chapter={chapterOpen} onChange={openChapter} settings={settings} />
            </>
          ) : mode === 'week' ? (
            <DaySelector
              mode="week"
              selectedDay={weekDay}
              onDayChange={setWeekDay}
              onPickChapter={openChapter}
              language={language}
            />
          ) : mode === 'month' ? (
            <DaySelector
              mode="month"
              selectedDay={monthDay}
              onDayChange={setMonthDay}
              onPickChapter={openChapter}
              language={language}
            />
          ) : mode === 'number' ? (
            <NumberGrid language={language} onPickChapter={openChapter} />
          ) : (
            <FavoritesView settings={settings} onOpenChapter={openChapter} />
          )}

          {!chapterOpen && lastReadChapter > 0 && mode !== 'favorites' && (
            <div className="rounded-2xl border border-border bg-card/40 p-3 flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.18em] font-assistant text-muted-foreground">
                {t('continueReading', language)}
              </p>
              <Button size="sm" onClick={() => openChapter(lastReadChapter)} className="font-assistant">
                {t('chapter', language)} {lastReadChapter}
              </Button>
            </div>
          )}
        </main>

        <div className="px-4">
          <Footer language={language} />
        </div>
      </div>
    </div>
  );
};

export default Index;
