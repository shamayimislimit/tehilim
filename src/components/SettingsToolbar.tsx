import { useState } from 'react';
import { Share2, Download, Settings, Type, Languages, BookOpen, LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Language, PrayerFont, TehilimSettings } from '@/types/tehilim';
import { t } from '@/data/translations';
import config from '@/config.json';
import { useInstance } from '@/context/instance';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';

interface SettingsToolbarProps {
  settings: TehilimSettings;
  onUpdate: (u: Partial<TehilimSettings>) => void;
}

const PRAYER_FONT_OPTIONS: { value: PrayerFont; labelKey: 'fontFrank' | 'fontDavid' | 'fontAssistant'; previewClass: string }[] = [
  { value: 'frank', labelKey: 'fontFrank', previewClass: 'font-frank' },
  { value: 'david', labelKey: 'fontDavid', previewClass: 'font-david' },
  { value: 'assistant', labelKey: 'fontAssistant', previewClass: 'font-assistant' },
];

export const SettingsToolbar = ({ settings, onUpdate }: SettingsToolbarProps) => {
  const { language, fontSize, prayerFont, showCantillation, showNikkud, showVerseNumbers } = settings;
  const instance = useInstance();
  const { user, ready, requestLogin, logout } = useAuth();
  const supportedLanguages = config.settings.supportedLanguages as Language[];
  const isRtl = language === 'hebrew';
  const [installOpen, setInstallOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  const handleLogin = async () => {
    const value = email.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
      toast.error(language === 'french' ? 'Email invalide' : 'Invalid email');
      return;
    }
    setSending(true);
    try {
      await requestLogin(value);
      toast.success(
        language === 'french'
          ? 'Lien de connexion envoyé ✓ Vérifiez vos emails.'
          : 'Login link sent ✓ Check your inbox.'
      );
      setEmail('');
    } catch {
      toast.error(language === 'french' ? 'Échec de l’envoi. Réessayez.' : 'Send failed. Try again.');
    } finally {
      setSending(false);
    }
  };

  const handleShare = async () => {
    const title = `${instance.title.hebrew} - ${instance.dedication.hebrew}`;
    if (navigator.share) {
      try { await navigator.share({ title, url: window.location.href }); } catch { /* */ }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(t('share', language) + ' ✓');
    }
  };

  const handleInstall = () => {
    const dp = (window as any).deferredPrompt;
    if (dp) {
      dp.prompt();
      dp.userChoice.finally(() => ((window as any).deferredPrompt = null));
    } else {
      setInstallOpen(true);
      toast.info(language === 'french' ? 'Sur iPhone : Partager → Ajouter à l’écran d’accueil' : 'iPhone: Share → Add to Home Screen');
    }
  };

  return (
    // inline-end = always opposite the back button, so it never covers it
    <div className="fixed top-3 end-3 z-30">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 rounded-full bg-background/90 backdrop-blur-md hover:bg-background shadow-[var(--shadow-soft)] border border-border"
          >
            <Settings className="w-4 h-4 text-primary" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80 p-5 space-y-5 rounded-2xl bg-background/95 backdrop-blur-md border-2 border-border/60 shadow-[var(--shadow-elegant)]"
          align="end"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare} className="flex-1 gap-2 font-assistant">
              <Share2 className="w-4 h-4" />
              {t('share', language)}
            </Button>
            <Button variant="outline" size="sm" onClick={handleInstall} className="flex-1 gap-2 font-assistant">
              <Download className="w-4 h-4" />
              {t('install', language)}
            </Button>
          </div>

          {/* Account — login keeps your reading progress across devices */}
          <div className="space-y-2 rounded-xl bg-muted/30 p-3">
            {!ready ? null : user ? (
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 min-w-0 text-xs font-assistant text-muted-foreground">
                  <User className="w-4 h-4 shrink-0 text-primary" />
                  <span className="truncate" dir="ltr">{user.email}</span>
                </span>
                <Button variant="ghost" size="sm" onClick={logout} className="gap-1.5 font-assistant shrink-0">
                  <LogOut className="w-4 h-4" />
                  {language === 'french' ? 'Quitter' : 'Logout'}
                </Button>
              </div>
            ) : (
              <>
                <Label className="text-xs font-cormorant font-semibold flex items-center gap-2">
                  <LogIn className="w-4 h-4 text-primary" />
                  {language === 'french' ? 'Garder ma progression' : 'Save my progress'}
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    inputMode="email"
                    dir="ltr"
                    placeholder="email@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    className="h-9 rounded-lg font-assistant text-sm"
                  />
                  <Button size="sm" onClick={handleLogin} disabled={sending} className="font-assistant shrink-0">
                    {sending ? '…' : language === 'french' ? 'Lien' : 'Link'}
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Font size */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-primary" />
              <Label className="text-xs font-cormorant font-semibold">
                {t('fontSize', language)} · {fontSize}px
              </Label>
            </div>
            <Slider
              value={[fontSize]}
              onValueChange={([v]) => onUpdate({ fontSize: v })}
              min={16}
              max={36}
              step={1}
            />
          </div>

          {/* Prayer font */}
          <div className="space-y-3">
            <Label className="text-xs font-cormorant font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              {t('prayerFont', language)}
            </Label>
            <Select value={prayerFont} onValueChange={(v) => onUpdate({ prayerFont: v as PrayerFont })}>
              <SelectTrigger className="h-10 rounded-xl border-2 font-assistant">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {PRAYER_FONT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className={opt.previewClass}>
                    <span className={opt.previewClass}>אבג&nbsp;·&nbsp;</span>
                    <span className="font-assistant text-xs text-muted-foreground">
                      {t(opt.labelKey, language)}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Display toggles */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/30">
              <Label className="text-xs font-cormorant font-semibold">{t('showCantillation', language)}</Label>
              <Switch checked={showCantillation} onCheckedChange={(v) => onUpdate({ showCantillation: v })} />
            </div>
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/30">
              <Label className="text-xs font-cormorant font-semibold">{t('showNikkud', language)}</Label>
              <Switch checked={showNikkud} onCheckedChange={(v) => onUpdate({ showNikkud: v })} />
            </div>
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/30">
              <Label className="text-xs font-cormorant font-semibold">{t('showVerseNumbers', language)}</Label>
              <Switch checked={showVerseNumbers} onCheckedChange={(v) => onUpdate({ showVerseNumbers: v })} />
            </div>
          </div>

          {/* Language */}
          <div className="space-y-3">
            <Label className="text-xs font-cormorant font-semibold flex items-center gap-2">
              <Languages className="w-4 h-4 text-primary" />
              {t('language', language)}
            </Label>
            <Select value={language} onValueChange={(v) => onUpdate({ language: v as Language })}>
              <SelectTrigger className="h-10 rounded-xl border-2 font-assistant">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {supportedLanguages.map((lang) => (
                  <SelectItem key={lang} value={lang} className="font-assistant">
                    {lang === 'hebrew' ? 'עברית' : lang === 'french' ? 'Français' : 'English'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
