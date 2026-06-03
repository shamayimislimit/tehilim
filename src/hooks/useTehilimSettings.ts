import { useState, useEffect } from 'react';
import { Language, PrayerFont, ReadMode, TehilimSettings } from '@/types/tehilim';
import config from '@/config.json';

const STORAGE_KEY = 'tehilim-settings';

const detectLanguage = (): Language => {
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

const buildDefaults = (): TehilimSettings => ({
  fontSize: config.settings.defaults.fontSize,
  language: detectLanguage(),
  phoneticMode: config.settings.defaults.phoneticMode,
  prayerFont: (config.settings.defaults.prayerFont as PrayerFont) ?? 'frank',
  showCantillation: config.settings.defaults.showCantillation,
  showNikkud: config.settings.defaults.showNikkud,
  showVerseNumbers: config.settings.defaults.showVerseNumbers,
  mode: (config.settings.defaults.mode as ReadMode) ?? 'week',
  lastReadChapter: config.settings.defaults.lastReadChapter ?? 1,
});

const readStored = (): TehilimSettings | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return { ...buildDefaults(), ...JSON.parse(raw) };
  } catch {
    return null;
  }
};

export const useTehilimSettings = () => {
  const [settings, setSettings] = useState<TehilimSettings>(() => readStored() ?? buildDefaults());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignored */
    }
  }, [settings]);

  const updateSettings = (updates: Partial<TehilimSettings>) =>
    setSettings((prev) => ({ ...prev, ...updates }));

  return { settings, updateSettings };
};
