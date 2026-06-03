import { Language } from '@/types/tehilim';

type Trans = Record<Language, string>;

export const translations = {
  appTitle: { hebrew: 'ספר תהילים', french: 'Livre des Tehilim', english: 'Book of Tehilim' } as Trans,
  modeWeek: { hebrew: 'שבועי', french: 'Semaine', english: 'Week' } as Trans,
  modeMonth: { hebrew: 'חודשי', french: 'Mois', english: 'Month' } as Trans,
  modeNumber: { hebrew: 'לפי מספר', french: 'Par numéro', english: 'By number' } as Trans,
  modeFavorites: { hebrew: 'מועדפים', french: 'Favoris', english: 'Favorites' } as Trans,
  chapter: { hebrew: 'פרק', french: 'Chapitre', english: 'Chapter' } as Trans,
  verse: { hebrew: 'פסוק', french: 'Verset', english: 'Verse' } as Trans,
  day: { hebrew: 'יום', french: 'Jour', english: 'Day' } as Trans,
  today: { hebrew: 'היום', french: "Aujourd'hui", english: 'Today' } as Trans,
  continueReading: { hebrew: 'המשך לקרוא', french: 'Continuer', english: 'Continue' } as Trans,
  markRead: { hebrew: 'סמן כנקרא', french: 'Marquer comme lu', english: 'Mark as read' } as Trans,
  markUnread: { hebrew: 'בטל סימון', french: 'Marquer non lu', english: 'Unread' } as Trans,
  read: { hebrew: 'נקרא', french: 'lu', english: 'read' } as Trans,
  progress: { hebrew: 'התקדמות', french: 'Progression', english: 'Progress' } as Trans,
  resetProgress: { hebrew: 'איפוס התקדמות', french: 'Réinitialiser', english: 'Reset progress' } as Trans,
  settings: { hebrew: 'הגדרות', french: 'Paramètres', english: 'Settings' } as Trans,
  fontSize: { hebrew: 'גודל גופן', french: 'Taille de police', english: 'Font size' } as Trans,
  prayerFont: { hebrew: 'גופן התפילה', french: 'Police', english: 'Font' } as Trans,
  fontFrank: { hebrew: 'פרנק (קלאסי)', french: 'Frank Ruhl (classique)', english: 'Frank Ruhl (classic)' } as Trans,
  fontDavid: { hebrew: 'דוד (תורני)', french: 'David (Torah)', english: 'David (Torah)' } as Trans,
  fontAssistant: { hebrew: 'אסיסטנט (מודרני)', french: 'Assistant (moderne)', english: 'Assistant (modern)' } as Trans,
  showCantillation: { hebrew: 'הצג טעמים', french: 'Cantillation (טעמים)', english: 'Cantillation marks' } as Trans,
  showNikkud: { hebrew: 'הצג ניקוד', french: 'Voyelles (ניקוד)', english: 'Vowels' } as Trans,
  showVerseNumbers: { hebrew: 'הצג מספרי פסוקים', french: 'Numéros de versets', english: 'Verse numbers' } as Trans,
  language: { hebrew: 'שפה', french: 'Langue', english: 'Language' } as Trans,
  share: { hebrew: 'שתף', french: 'Partager', english: 'Share' } as Trans,
  install: { hebrew: 'התקן', french: 'Installer', english: 'Install' } as Trans,
  favorites: { hebrew: 'מועדפים', french: 'Favoris', english: 'Favorites' } as Trans,
  addToFavorites: { hebrew: 'הוסף למועדפים', french: 'Ajouter aux favoris', english: 'Add to favorites' } as Trans,
  removeFromFavorites: { hebrew: 'הסר מהמועדפים', french: 'Retirer des favoris', english: 'Remove' } as Trans,
  favoriteName: { hebrew: 'שם הקובץ', french: 'Nom de la collection', english: 'Collection name' } as Trans,
  favoriteNameHint: {
    hebrew: 'לדוגמה: לעילוי נשמה, לרפואה, ליעקב…',
    french: 'Ex : Pour Yehouda, Pour la guérison, Bénédiction…',
    english: 'E.g. For Yehuda, For healing, Blessing…',
  } as Trans,
  newCollection: { hebrew: 'קובץ חדש', french: 'Nouvelle collection', english: 'New collection' } as Trans,
  save: { hebrew: 'שמור', french: 'Enregistrer', english: 'Save' } as Trans,
  cancel: { hebrew: 'ביטול', french: 'Annuler', english: 'Cancel' } as Trans,
  emptyFavorites: {
    hebrew: 'עדיין אין פסוקים מועדפים. הקש על כוכב ליד פסוק כדי להוסיף.',
    french: "Aucun favori pour le moment. Touchez l'étoile à côté d'un verset pour l'ajouter.",
    english: 'No favorites yet. Tap the star next to a verse to add one.',
  } as Trans,
  wholeChapter: { hebrew: 'כל הפרק', french: 'Tout le chapitre', english: 'Whole chapter' } as Trans,
  pickChapter: { hebrew: 'בחר פרק', french: 'Choisir un chapitre', english: 'Pick a chapter' } as Trans,
  chaptersOfTheDay: { hebrew: 'פרקי היום', french: 'Chapitres du jour', english: "Today's chapters" } as Trans,
  dayNamesHe: ['', 'יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי', 'שבת'],
  dayNamesFr: ['', 'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Chabbat'],
  dayNamesEn: ['', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Shabbat'],
} as const;

export const t = (key: keyof typeof translations, language: Language): string => {
  const item = translations[key] as unknown;
  if (item && typeof item === 'object' && 'hebrew' in (item as object)) {
    return (item as Trans)[language];
  }
  return '';
};

export const dayName = (jsDayIndex: number, language: Language): string => {
  const i = jsDayIndex + 1;
  const arr =
    language === 'hebrew' ? translations.dayNamesHe
    : language === 'french' ? translations.dayNamesFr
    : translations.dayNamesEn;
  return arr[i] ?? '';
};
