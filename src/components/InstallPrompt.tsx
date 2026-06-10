import { useEffect, useState } from 'react';
import { Download, X, Share, Plus } from 'lucide-react';
import { Language } from '@/types/tehilim';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

/** True when the app already runs as an installed PWA (home-screen / standalone). */
const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as unknown as { standalone?: boolean }).standalone === true;

const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

const DISMISS_KEY = 'tehilim-install-dismissed';

const tr = (language: Language, fr: string, en: string, he: string) =>
  language === 'french' ? fr : language === 'hebrew' ? he : en;

/**
 * Full-width top bar inviting the user to install the app, styled to match the
 * app (soft blur, elegant type, primary chip). Shown only when not already
 * installed, the device is installable, and not dismissed. On iOS (no
 * `beforeinstallprompt`) tapping opens a clear step-by-step dialog rather than
 * a toast. Reserves its height via the --banner-h CSS var so everything else
 * shifts below it.
 */
export const InstallPrompt = ({ language }: { language: Language }) => {
  const [deferred, setDeferred] = useState<(Event & { prompt: () => void; userChoice: Promise<unknown> }) | null>(
    () => ((window as unknown as { deferredPrompt?: never }).deferredPrompt ?? null)
  );
  const [installed, setInstalled] = useState(isStandalone());
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === '1');
  const [iosOpen, setIosOpen] = useState(false);

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
    document.documentElement.style.setProperty('--banner-h', show ? '52px' : '0px');
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
      setIosOpen(true); // iOS can't auto-prompt → show clear steps
    }
  };

  const isRtl = language === 'hebrew';
  const titleFont = isRtl ? 'font-david' : 'font-cormorant';

  return (
    <>
      <div
        className="fixed top-0 inset-x-0 z-50 h-[52px] flex items-center gap-2.5 px-3 bg-background/85 backdrop-blur-md border-b border-primary/20 shadow-[var(--shadow-soft)]"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <button type="button" onClick={handleInstall} className="flex flex-1 min-w-0 items-center gap-2.5 text-start">
          <span className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Download className="w-4 h-4 text-primary" />
          </span>
          <span className="min-w-0">
            <span className={`block ${titleFont} text-base leading-tight text-foreground truncate`}>
              {tr(language, "Installer l’application", 'Install the app', 'התקנת האפליקציה')}
            </span>
            <span className="block text-[11px] font-assistant text-muted-foreground leading-tight truncate">
              {tr(language, "Sur l’écran d’accueil", 'On your home screen', 'אל מסך הבית')}
            </span>
          </span>
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label={tr(language, 'Fermer', 'Dismiss', 'סגירה')}
          className="shrink-0 p-1.5 rounded-full text-muted-foreground/60 hover:text-foreground hover:bg-muted/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* iOS install instructions — a dialog is far more visible than a toast */}
      <Dialog open={iosOpen} onOpenChange={setIosOpen}>
        <DialogContent className="sm:max-w-sm rounded-2xl" dir={isRtl ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className={`${titleFont} text-2xl flex items-center gap-2`}>
              <Download className="w-5 h-5 text-primary" />
              {tr(language, "Installer l’application", 'Install the app', 'התקנת האפליקציה')}
            </DialogTitle>
            <DialogDescription className="font-assistant">
              {tr(
                language,
                'En deux étapes, depuis Safari :',
                'In two steps, from Safari:',
                'בשני שלבים, מתוך Safari:'
              )}
            </DialogDescription>
          </DialogHeader>

          <ol className="space-y-3">
            <li className="flex items-center gap-3 rounded-xl bg-muted/40 p-3">
              <span className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Share className="w-4 h-4 text-primary" />
              </span>
              <span className="text-sm font-assistant leading-snug">
                {tr(
                  language,
                  'Appuyez sur le bouton Partager',
                  'Tap the Share button',
                  'הקישו על כפתור השיתוף'
                )}
              </span>
            </li>
            <li className="flex items-center gap-3 rounded-xl bg-muted/40 p-3">
              <span className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Plus className="w-4 h-4 text-primary" />
              </span>
              <span className="text-sm font-assistant leading-snug">
                {tr(
                  language,
                  'Choisissez « Sur l’écran d’accueil »',
                  'Choose “Add to Home Screen”',
                  'בחרו “הוסף למסך הבית”'
                )}
              </span>
            </li>
          </ol>
        </DialogContent>
      </Dialog>
    </>
  );
};
