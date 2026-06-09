import { Language, PrayerFont, ReadMode, TehilimSettings } from '@/types/tehilim';
import config from '@/config.json';

/** Browser-language detection: Hebrew if requested & supported, else French, else config default. */
export const detectLanguage = (): Language => {
  const supported = config.settings.supportedLanguages as Language[];
  const candidates: string[] = [
    ...(typeof navigator !== 'undefined' && Array.isArray(navigator.languages) ? navigator.languages : []),
    typeof navigator !== 'undefined' ? navigator.language : '',
  ].filter(Boolean);
  const isHe = candidates.some((raw) => {
    const tag = raw.toLowerCase().split('-')[0];
    return tag === 'he' || tag === 'iw';
  });
  if (isHe && supported.includes('hebrew')) return 'hebrew';
  if (supported.includes('french')) return 'french';
  return config.settings.defaults.language as Language;
};

export const buildDefaultSettings = (): TehilimSettings => ({
  fontSize: config.settings.defaults.fontSize,
  language: detectLanguage(),
  phoneticMode: config.settings.defaults.phoneticMode,
  prayerFont: (config.settings.defaults.prayerFont as PrayerFont) ?? 'frank',
  showCantillation: config.settings.defaults.showCantillation,
  showNikkud: config.settings.defaults.showNikkud,
  showVerseNumbers: config.settings.defaults.showVerseNumbers,
  mode: (config.settings.defaults.mode as ReadMode) ?? 'week',
});
