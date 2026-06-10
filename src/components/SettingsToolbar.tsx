import { Share2, Settings, Type, Languages, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Language, PrayerFont, TehilimSettings } from '@/types/tehilim';
import { t } from '@/data/translations';
import config from '@/config.json';
import { useInstance } from '@/context/instance';
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
  const supportedLanguages = config.settings.supportedLanguages as Language[];
  const isRtl = language === 'hebrew';

  const handleShare = async () => {
    const title = `${instance.title.hebrew} - ${instance.dedication.hebrew}`;
    if (navigator.share) {
      try { await navigator.share({ title, url: window.location.href }); } catch { /* */ }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(t('share', language) + ' ✓');
    }
  };

  return (
    // Always pinned top-left (physical), opposite בס״ד; drops below the install bar.
    <div className="fixed left-3 z-30" style={{ top: 'calc(var(--banner-h, 0px) + 0.75rem)' }}>
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
          align="start"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          <Button variant="outline" size="sm" onClick={handleShare} className="w-full gap-2 font-assistant">
            <Share2 className="w-4 h-4" />
            {t('share', language)}
          </Button>

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
