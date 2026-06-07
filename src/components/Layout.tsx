import { useEffect } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { SettingsToolbar } from '@/components/SettingsToolbar';
import { Footer } from '@/components/Footer';
import { useTehilimSettings } from '@/hooks/useTehilimSettings';
import { TehilimSettings } from '@/types/tehilim';

export interface AppOutletContext {
  settings: TehilimSettings;
  updateSettings: (updates: Partial<TehilimSettings>) => void;
}

/** Settings shared by every routed page (single hook instance lives in Layout). */
export const useAppSettings = () => useOutletContext<AppOutletContext>();

export const Layout = () => {
  const { settings, updateSettings } = useTehilimSettings();

  // Keep <html dir/lang> in sync with the UI language so Tailwind `rtl:`
  // variants, flex direction and native scrollbars follow the right direction.
  useEffect(() => {
    const isRtl = settings.language === 'hebrew';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang =
      settings.language === 'hebrew' ? 'he' : settings.language === 'french' ? 'fr' : 'en';
  }, [settings.language]);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      (window as any).deferredPrompt = e;
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-[var(--gradient-wedding)] -z-10" />
      <div className="fixed inset-0 bg-[var(--gradient-overlay)] -z-10" />

      <SettingsToolbar settings={settings} onUpdate={updateSettings} />

      <div className="max-w-3xl mx-auto">
        <Outlet context={{ settings, updateSettings } satisfies AppOutletContext} />

        <div className="px-4">
          <Footer language={settings.language} />
        </div>
      </div>
    </div>
  );
};
