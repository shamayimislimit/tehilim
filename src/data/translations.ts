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
  settings: { hebrew: 'הגדרות', french: 'Paramètres', english: 'Settings' } as Trans,
  fontSize: { hebrew: 'גודל גופן', french: 'Taille de police', english: 'Font size' } as Trans,
  prayerFont: { hebrew: 'גופן התפילה', french: 'Police', english: 'Font' } as Trans,
  fontFrank: { hebrew: 'פרנק (קלאסי)', french: 'Frank Ruhl (classique)', english: 'Frank Ruhl (classic)' } as Trans,
  fontDavid: { hebrew: 'דוד (תורני)', french: 'David (Torah)', english: 'David (Torah)' } as Trans,
  fontAssistant: { hebrew: 'אסיסטנט (מודרני)', french: 'Assistant (moderne)', english: 'Assistant (modern)' } as Trans,
  showCantillation: { hebrew: 'הצג טעמים', french: 'Cantillation (טעמים)', english: 'Cantillation marks' } as Trans,
  showNikkud: { hebrew: 'הצג ניקוד', french: 'Voyelles (ניקוד)', english: 'Vowels' } as Trans,
  showVerseNumbers: { hebrew: 'הצג מספרי פסוקים', french: 'Numéros de versets', english: 'Verse numbers' } as Trans,
  phonetic: { hebrew: 'תעתיק פונטי', french: 'Phonétique', english: 'Phonetic' } as Trans,
  language: { hebrew: 'שפה', french: 'Langue', english: 'Language' } as Trans,
  share: { hebrew: 'שתף', french: 'Partager', english: 'Share' } as Trans,
  install: { hebrew: 'התקן', french: 'Installer', english: 'Install' } as Trans,
  favorites: { hebrew: 'מועדפים', french: 'Favoris', english: 'Favorites' } as Trans,
  addToFavorites: { hebrew: 'הוסף למועדפים', french: 'Ajouter aux favoris', english: 'Add to favorites' } as Trans,
  bookmark: { hebrew: 'סימניה', french: 'Marque-page', english: 'Bookmark' } as Trans,
  addBookmark: { hebrew: 'סמן כאן את המקום שבו עצרתי', french: 'Marquer où je me suis arrêté(e)', english: 'Mark where I stopped' } as Trans,
  removeBookmark: { hebrew: 'הסר סימניה', french: 'Retirer le marque-page', english: 'Remove bookmark' } as Trans,
  bookmarkSaved: { hebrew: 'הסימניה נשמרה בפרק', french: 'Marque-page placé au chapitre', english: 'Bookmark set at chapter' } as Trans,
  bookmarkRemoved: { hebrew: 'הסימניה הוסרה', french: 'Marque-page retiré', english: 'Bookmark removed' } as Trans,
  removeFromFavorites: { hebrew: 'הסר מהמועדפים', french: 'Retirer des favoris', english: 'Remove' } as Trans,
  favoriteName: { hebrew: 'שם (לא חובה)', french: 'Nom (optionnel)', english: 'Name (optional)' } as Trans,
  favoriteNameHint: {
    hebrew: 'לדוגמה: לעילוי נשמה, לרפואה, ליעקב…',
    french: 'Ex : Pour Yehouda, Pour la guérison, Bénédiction…',
    english: 'E.g. For Yehuda, For healing, Blessing…',
  } as Trans,
  editFavorite: { hebrew: 'עריכת מועדף', french: 'Modifier le favori', english: 'Edit favorite' } as Trans,
  favoriteChapter: { hebrew: 'מספר פרק', french: 'Numéro de chapitre', english: 'Chapter number' } as Trans,
  invalidChapter: {
    hebrew: 'יש להזין מספר פרק בין 1 ל‑150',
    french: 'Numéro de chapitre entre 1 et 150',
    english: 'Chapter number between 1 and 150',
  } as Trans,
  duplicateFavorite: {
    hebrew: 'הפרק הזה כבר שמור באותו שם',
    french: 'Ce chapitre est déjà enregistré sous ce nom',
    english: 'This chapter is already saved under this name',
  } as Trans,
  save: { hebrew: 'שמור', french: 'Enregistrer', english: 'Save' } as Trans,
  cancel: { hebrew: 'ביטול', french: 'Annuler', english: 'Cancel' } as Trans,
  emptyFavorites: {
    hebrew: 'עדיין אין פרקים מועדפים. הקשו על הכוכב בראש פרק כדי להוסיף.',
    french: "Aucun favori pour le moment. Touchez l'étoile en haut d'un chapitre pour l'ajouter.",
    english: 'No favorites yet. Tap the star at the top of a chapter to add it.',
  } as Trans,
  pickChapter: { hebrew: 'בחר פרק', french: 'Choisir un chapitre', english: 'Pick a chapter' } as Trans,
  chaptersOfTheDay: { hebrew: 'פרקי היום', french: 'Chapitres du jour', english: "Today's chapters" } as Trans,
  todayReading: { hebrew: 'קריאת היום', french: 'Lecture du jour', english: "Today's reading" } as Trans,
  whatToRead: { hebrew: 'מה תרצו לקרוא?', french: 'Que souhaitez-vous lire ?', english: 'What would you like to read?' } as Trans,
  finishInWeek: { hebrew: 'כל הספר בשבעה ימים', french: 'Tout le livre en 7 jours', english: 'The whole book in 7 days' } as Trans,
  finishInMonth: { hebrew: 'כל הספר בשלושים יום', french: 'Tout le livre en 30 jours', english: 'The whole book in 30 days' } as Trans,
  numberDesc: { hebrew: 'בחירת פרק מתוך 150', french: 'Choisir un chapitre parmi 150', english: 'Pick one of 150 chapters' } as Trans,
  favoritesDesc: { hebrew: 'הפרקים שבחרתם', french: 'Vos tehilim choisis', english: 'Your chosen tehilim' } as Trans,
  chooseDay: { hebrew: 'בחרו יום', french: 'Choisissez un jour', english: 'Choose a day' } as Trans,
  back: { hebrew: 'חזרה', french: 'Retour', english: 'Back' } as Trans,
  yehiRatzonHeading: { hebrew: 'יְהִי רָצוֹן', french: 'Yehi Ratzon', english: 'Yehi Ratzon' } as Trans,
  prayerBeforeLabel: { hebrew: 'לִפְנֵי', french: 'Avant', english: 'Before' } as Trans,
  prayerAfterLabel: { hebrew: 'לְאַחַר', french: 'Après', english: 'After' } as Trans,
  prayerReadingSub: { hebrew: 'הַקְּרִיאָה', french: 'la lecture', english: 'the reading' } as Trans,
  tikounTitle: { hebrew: 'תִּקּוּן הַכְּלָלִי', french: 'Tikoun Haklali', english: 'Tikkun HaKlali' } as Trans,
  tikounDesc: {
    hebrew: 'עֲשָׂרָה מִזְמוֹרֵי תְּהִלִּים',
    french: 'Les dix psaumes du Tikoun',
    english: 'The ten Tehilim of the Tikkun',
  } as Trans,
  reorder: { hebrew: 'שנה סדר', french: "Réordonner", english: 'Reorder' } as Trans,
  browseAllTehilim: {
    hebrew: 'עיון בכל הפרקים',
    french: 'Parcourir tous les Tehilim',
    english: 'Browse all Tehilim',
  } as Trans,
  loginCta: { hebrew: 'התחברות', french: 'Se connecter', english: 'Log in' } as Trans,
  favNotLoggedTitle: {
    hebrew: 'אינך מחובר/ת',
    french: 'Tu n’es pas connectée',
    english: 'You’re not logged in',
  } as Trans,
  favNotLoggedHasLocal: {
    hebrew: 'המועדפים האלה שמורים במכשיר הזה בלבד. התחבר/י כדי לשמור אותם ולמצוא אותם בכל מכשיר.',
    french: 'Ces favoris sont enregistrés sur cet appareil uniquement. Connecte-toi pour les sauvegarder et les retrouver sur tous tes appareils.',
    english: 'These favorites are saved on this device only. Log in to save them and find them on all your devices.',
  } as Trans,
  favNotLoggedNoLocal: {
    hebrew: 'יש לך מועדפים שמורים? התחבר/י כדי לראות אותם. כל מה שתוסיף/י לאחר ההתחברות יישמר בכל המכשירים.',
    french: 'Tu as déjà des favoris enregistrés ? Connecte-toi pour les retrouver. Tout ce que tu ajoutes après connexion sera sauvegardé sur tous tes appareils.',
    english: 'Already have saved favorites? Log in to see them. Anything you add after logging in is saved across your devices.',
  } as Trans,
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
