import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { Language } from '@/types/tehilim';
import { toast } from 'sonner';

/** True when the app already runs as an installed PWA (home-screen / standalone). */
const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as unknown as { standalone?: boolean }).standalone === true;

const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

const DISMISS_KEY = 'tehilim-install-dismissed';

const tr = (language: Language, fr: string, en: string, he: string) =>
  language === 'french' ? fr : language === 'hebrew' ? he : en;

/**
 * Top banner inviting the user to install the app. Shown ONLY when not already
 * installed, the device is installable (Chrome/Android/desktop fire
 * `beforeinstallprompt`; iOS Safari can't → manual instructions), and the user
 * hasn't dismissed it. Lives on the home page — not in the settings menu.
 */
export const InstallPrompt = ({ language }: { language: Language }) => {
  const [deferred, setDeferred] = useState<(Event & { prompt: () => void; userChoice: Promise<unknown> }) | null>(
    () => ((window as unknown as { deferredPrompt?: never }).deferredPrompt ?? null)
  );
  const [installed, setInstalled] = useState(isStandalone());
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === '1');

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

  const show = !installed && !dismissed && (!!deferred || isIOS());

  // Reserve space for the fixed top bar: everything else reads --banner-h
  // (root padding, the floating controls' top, the sticky PageHeader's top).
  useEffect(() => {
    document.documentElement.style.setProperty('--banner-h', show ? '44px' : '0px');
    return () => document.documentElement.style.setProperty('--banner-h', '0px');
  }, [show]);

  if (!show) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
  };

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

  const isRtl = language === 'hebrew';

  // Full-width bar pinned to the very top, above everything (z above the
  // floating controls + sticky headers, which sit below it via --banner-h).
  return (
    <div
      className="fixed top-0 inset-x-0 z-50 h-11 flex items-center gap-2 px-3 bg-primary text-primary-foreground shadow-md"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <button type="button" onClick={handleInstall} className="flex flex-1 min-w-0 items-center gap-2 text-start">
        <Download className="w-4 h-4 shrink-0" />
        <span className={`truncate ${isRtl ? 'font-david' : 'font-assistant'} text-sm font-medium`}>
          {tr(language, "Installer l’application", 'Install the app', 'התקנת האפליקציה')}
        </span>
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label={tr(language, 'Fermer', 'Dismiss', 'סגירה')}
        className="shrink-0 p-1.5 rounded-full text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/15 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
