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

  if (installed || dismissed) return null;
  if (!deferred && !isIOS()) return null; // not installable on this device/browser

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

  return (
    <div
      className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2.5"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <button type="button" onClick={handleInstall} className="flex flex-1 min-w-0 items-center gap-3 text-start">
        <span className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
          <Download className="w-[18px] h-[18px] text-primary" />
        </span>
        <span className="flex-1 min-w-0">
          <span className={`block ${isRtl ? 'font-david' : 'font-cormorant'} text-base leading-tight`}>
            {tr(language, "Installer l’application", 'Install the app', 'התקנת האפליקציה')}
          </span>
          <span className="block text-xs font-assistant text-muted-foreground truncate">
            {tr(language, "Accès rapide depuis l’écran d’accueil", 'Quick access from your home screen', 'גישה מהירה ממסך הבית')}
          </span>
        </span>
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label={tr(language, 'Fermer', 'Dismiss', 'סגירה')}
        className="shrink-0 p-1.5 rounded-full text-muted-foreground/60 hover:text-foreground hover:bg-background/60 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
