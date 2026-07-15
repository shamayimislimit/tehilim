import { useEffect, useState } from 'react';

/**
 * Lazy access to the French-Sephardi phonetic dataset (src/data/tehilim.phonetic.json,
 * ~150 KB). It is dynamically imported (its own chunk) only when the phonetic
 * toggle is turned ON, so the default reader bundle stays lean. Shape: { [chapter]: string[] }.
 */
export type PhoneticData = Record<string, string[]>;

let cache: PhoneticData | null = null;
let pending: Promise<PhoneticData> | null = null;

export function loadPhonetic(): Promise<PhoneticData> {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = import('@/data/tehilim.phonetic.json').then((m) => {
      cache = (m.default ?? m) as PhoneticData;
      return cache;
    });
  }
  return pending;
}

/** Returns the phonetic dataset (or null until loaded). Only fetches when `enabled`. */
export function usePhonetic(enabled: boolean): PhoneticData | null {
  const [data, setData] = useState<PhoneticData | null>(cache);
  useEffect(() => {
    if (!enabled) return;
    if (cache) { setData(cache); return; }
    let alive = true;
    loadPhonetic().then((d) => { if (alive) setData(d); });
    return () => { alive = false; };
  }, [enabled]);
  return data;
}
