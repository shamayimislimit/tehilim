import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { Language } from '@/types/tehilim';
import { toast } from 'sonner';

/** True when the app already runs as an installed PWA (home-screen / standalone). */
const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as unknown as { standalone?: boolean }).standalone === true;

const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

const tr = (language: Language, fr: string, en: string, he: string) =>
  language === 'french' ? fr : language === 'hebrew' ? he : en;

/**
 * Home-screen install affordance. Shown ONLY when the app is not already
 * installed AND it is installable (Chrome/Android/desktop fire
 * `beforeinstallprompt`; iOS Safari can't, so we surface manual instructions).
 * Lives on the home page — not in the settings menu.
 */
export const InstallPrompt = ({ language }: { language: Language }) => {
  const [deferred, setDeferred] = useState<(Event & { prompt: () => void; userChoice: Promise<unknown> }) | null>(
    () => ((window as unknown as { deferredPrompt?: never }).deferredPrompt ?? null)
  );
  const [installed, setInstalled] = useState(isStandalone());

  useEffect(() => {
    const onBIP = (e: Event) => {
      e.preventDefault();
      (window as unknown as { deferredPrompt?: Event }).deferredPrompt = e;
      setDeferred(e as never);
    };
    const onInstalled = () => {
      setInstalled(true);
      (window as unknown as { deferredPrompt?: null }).deferredPrompt = null;
      setDeferred(null);
    };
    window.addEventListener('beforeinstallprompt', onBIP);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBIP);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed) return null;
  if (!deferred && !isIOS()) return null; // not installable on this device/browser

  const handleInstall = async () => {
    if (deferred) {
      deferred.prompt();
      try {
        await deferred.userChoice;
      } finally {
        (window as unknown as { deferredPrompt?: null }).deferredPrompt = null;
        setDeferred(null);
      }
    } else {
      toast.info(
        tr(
          language,
          'Sur iPhone : appuyez sur Partager puis « Sur l’écran d’accueil »',
          'On iPhone: tap Share, then “Add to Home Screen”',
          'באייפון: הקישו על שיתוף ואז “הוסף למסך הבית”'
        )
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleInstall}
      className="w-full rounded-2xl border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors px-4 py-3 flex items-center gap-3"
    >
      <span className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
        <Download className="w-[18px] h-[18px] text-primary" />
      </span>
      <span className="flex-1 min-w-0 text-start">
        <span className={`block ${language === 'hebrew' ? 'font-david' : 'font-cormorant'} text-base leading-tight`}>
          {tr(language, "Installer l’application", 'Install the app', 'התקנת האפליקציה')}
        </span>
        <span className="block text-xs font-assistant text-muted-foreground truncate">
          {tr(language, "Accès rapide depuis l’écran d’accueil", 'Quick access from your home screen', 'גישה מהירה ממסך הבית')}
        </span>
      </span>
    </button>
  );
};
