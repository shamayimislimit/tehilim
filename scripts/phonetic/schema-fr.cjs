// French Sephardi phonetic schema for hebrew-transliteration v2.
// Modeled on the cyber-contact.com convention (ch / kh / ou / é / è / Adonaï),
// Sephardi pronunciation (qamats = a, tav without dagesh = t, no gemination).
// Refined per Sarah's review before scaling to 150.
//
// ALEF/AYIN emit sentinels (U+0002 / U+0001); translit.js turns a sentinel into
// an apostrophe ONLY when it sits between two vowels (roi -> ro'i, haich -> ha'ich)
// and drops it elsewhere (word-initial / next to a consonant).
const AYIN_MARK = String.fromCharCode(1); // U+0001 sentinel
const ALEF_MARK = String.fromCharCode(2); // U+0002 sentinel

module.exports = {
  AYIN_MARK,
  ALEF_MARK,

  // consonants
  ALEF: ALEF_MARK, BET: 'v', BET_DAGESH: 'b',
  GIMEL: 'g', GIMEL_DAGESH: 'g',
  DALET: 'd', DALET_DAGESH: 'd',
  HE: 'h', VAV: 'v', ZAYIN: 'z',
  HET: "'h", TET: 't', YOD: 'y',
  KAF: 'kh', KAF_DAGESH: 'k', FINAL_KAF: 'kh',
  LAMED: 'l', MEM: 'm', FINAL_MEM: 'm',
  NUN: 'n', FINAL_NUN: 'n', SAMEKH: 's',
  AYIN: AYIN_MARK, PE: 'f', PE_DAGESH: 'p', FINAL_PE: 'f',
  TSADI: 'ts', FINAL_TSADI: 'ts', QOF: 'k', RESH: 'r',
  SHIN: 'ch', SIN: 's', TAV: 't', TAV_DAGESH: 't',

  // vowels
  VOCAL_SHEVA: 'e',
  HATAF_SEGOL: 'è', HATAF_PATAH: 'a', HATAF_QAMATS: 'o',
  HIRIQ: 'i', HIRIQ_YOD: 'i',
  TSERE: 'é', TSERE_YOD: 'é', TSERE_HE: 'é',
  SEGOL: 'è', SEGOL_YOD: 'è', SEGOL_HE: 'è',
  PATAH: 'a', FURTIVE_PATAH: 'a', PATAH_HE: 'a',
  QAMATS: 'a', QAMATS_QATAN: 'o', QAMATS_HE: 'a',
  HOLAM: 'o', HOLAM_VAV: 'o', HOLAM_HASER: 'o',
  QUBUTS: 'ou', SHUREQ: 'ou',

  // names & structure
  DIVINE_NAME: 'Adonaï',
  MS_SUFX: 'aw',
  MAQAF: '-', PASEQ: '', SOF_PASUQ: '',
  SYLLABLE_SEPARATOR: '', STRESS_MARKER: '',
  DAGESH: '', DAGESH_CHAZAQ: false,

  // rule flags
  qametsQatan: true,
  wawShureq: true,
  longVowels: true,
  article: true,
  sqnmlvy: true,
  shevaWithMeteg: false,
  allowNoNiqqud: true,
  strict: false,
};
