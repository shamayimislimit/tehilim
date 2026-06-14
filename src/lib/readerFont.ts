import { PrayerFont } from '@/types/tehilim';

const PICKER_CLASS: Record<PrayerFont, string> = {
  frank: 'font-frank',
  david: 'font-david',
  assistant: 'font-assistant',
};

/**
 * Font class for reading Hebrew text.
 *
 * Frank Ruhl Libre / David Libre have nikkud but NO cantillation (טעמים)
 * glyphs, so when cantillation is shown those clusters fall back to a
 * differently-sized font → mixed letter sizes. When cantillation is ON we
 * therefore render the whole text in a complete Hebrew font (Noto Serif/Sans
 * Hebrew, which cover ta'amim) so everything is uniform. With cantillation OFF
 * the picked font renders nikkud perfectly, so we keep the user's choice.
 */
export const readerFontClass = (font: PrayerFont, showCantillation: boolean): string => {
  if (!showCantillation) return PICKER_CLASS[font] ?? PICKER_CLASS.frank;
  return font === 'assistant' ? 'font-noto-sans-he' : 'font-noto-serif-he';
};
