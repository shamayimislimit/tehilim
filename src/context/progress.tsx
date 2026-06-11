import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { FavoritePerek, TehilimSettings } from '@/types/tehilim';
import { buildDefaultSettings } from '@/lib/settingsDefaults';
import { useAuth } from '@/context/auth';
import { getProgress, putProgress } from '@/lib/api';

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const slugKeyOf = (slug: string) => slug || 'default';
const settingsKey = (slug: string) => `tehilim:${slugKeyOf(slug)}:settings`;
const favoritesKey = (slug: string) => `tehilim:${slugKeyOf(slug)}:favorites`;

/** Perek-level favorites with optional label; tolerates the legacy v1 shape. */
const normalizeFavorites = (parsed: unknown): FavoritePerek[] => {
  if (!Array.isArray(parsed)) return [];
  const out: FavoritePerek[] = [];
  const seen = new Set<string>();
  for (const item of parsed) {
    const f = item as Record<string, unknown>;
    if (typeof f?.chapter !== 'number') continue;
    const name =
      typeof f.name === 'string' ? f.name : typeof f.collection === 'string' ? (f.collection as string).trim() : '';
    const key = `${f.chapter}|${name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      id: typeof f.id === 'string' ? f.id : uid(),
      chapter: f.chapter,
      name,
      addedAt: typeof f.addedAt === 'number' ? f.addedAt : Date.now(),
    });
  }
  return out;
};

const readLocalSettings = (slug: string): TehilimSettings => {
  const defaults = buildDefaultSettings();
  try {
    // Default instance inherits the pre-multi-instance global key on first run.
    const raw =
      localStorage.getItem(settingsKey(slug)) ?? (slug === '' ? localStorage.getItem('tehilim-settings') : null);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch {
    return defaults;
  }
};

const readLocalFavorites = (slug: string): FavoritePerek[] => {
  try {
    const raw =
      localStorage.getItem(favoritesKey(slug)) ?? (slug === '' ? localStorage.getItem('tehilim-favorites') : null);
    return raw ? normalizeFavorites(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
};

interface ProgressValue {
  settings: TehilimSettings;
  updateSettings: (updates: Partial<TehilimSettings>) => void;
  favorites: FavoritePerek[];
  addFavorite: (chapter: number, name: string) => void;
  removeFavorite: (id: string) => void;
  removeChapter: (chapter: number) => void;
  renameFavorite: (id: string, name: string) => void;
  isFavorited: (chapter: number) => boolean;
  /** Reorder favorites to match the given id order (drag & drop). */
  reorderFavorites: (orderedIds: string[]) => void;
}

const ProgressContext = createContext<ProgressValue | null>(null);

export const useProgress = (): ProgressValue => {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
};

/**
 * Owns settings + favorites for one instance, namespaced by slug.
 * - Logged out: localStorage only (per slug).
 * - Logged in: hydrate from server; if the server is empty, seed it from local
 *   (first-login merge); then persist every change to server (debounced) + local.
 */
export const ProgressProvider = ({ slug, children }: { slug: string; children: ReactNode }) => {
  const { token } = useAuth();
  const [settings, setSettings] = useState<TehilimSettings>(() => readLocalSettings(slug));
  const [favorites, setFavorites] = useState<FavoritePerek[]>(() => readLocalFavorites(slug));

  // Gate server writes until the initial server hydrate for this (slug, token) is done.
  const hydratedRef = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Re-seed local state when the instance changes.
  useEffect(() => {
    hydratedRef.current = false;
    setSettings(readLocalSettings(slug));
    setFavorites(readLocalFavorites(slug));
  }, [slug]);

  // Persist to localStorage on every change (always).
  useEffect(() => {
    try {
      localStorage.setItem(settingsKey(slug), JSON.stringify(settings));
    } catch {/* ignore */}
  }, [slug, settings]);

  useEffect(() => {
    try {
      localStorage.setItem(favoritesKey(slug), JSON.stringify(favorites));
    } catch {/* ignore */}
  }, [slug, favorites]);

  // Hydrate from / merge with server when authenticated.
  useEffect(() => {
    if (!token) {
      hydratedRef.current = false;
      return;
    }
    let cancelled = false;
    getProgress(token, slug)
      .then((remote) => {
        if (cancelled) return;
        if (remote?.settings) setSettings((prev) => ({ ...prev, ...remote.settings }));
        // MERGE (union by id), never replace: an empty server array (`[]` is
        // truthy in JS) must NOT wipe local favorites. Server order wins for
        // items it has; local-only favorites are appended. The debounced save
        // below then pushes the merged set back so the server gains the extras.
        const serverFavs = remote?.favorites ? normalizeFavorites(remote.favorites) : [];
        setFavorites((local) => {
          const seen = new Set<string>();
          const merged: FavoritePerek[] = [];
          for (const f of serverFavs) if (!seen.has(f.id)) { seen.add(f.id); merged.push(f); }
          for (const f of local) if (!seen.has(f.id)) { seen.add(f.id); merged.push(f); }
          return merged;
        });
      })
      .catch(() => {/* offline: keep local */})
      .finally(() => {
        if (!cancelled) hydratedRef.current = true;
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, slug]);

  // Debounced server save after hydrate.
  useEffect(() => {
    if (!token || !hydratedRef.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      putProgress(token, slug, { settings, favorites }).catch(() => {});
    }, 800);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [token, slug, settings, favorites]);

  const value: ProgressValue = {
    settings,
    updateSettings: (updates) => setSettings((prev) => ({ ...prev, ...updates })),
    favorites,
    addFavorite: (chapter, name) =>
      setFavorites((prev) => [...prev, { id: uid(), chapter, name: name.trim(), addedAt: Date.now() }]),
    removeFavorite: (id) => setFavorites((prev) => prev.filter((f) => f.id !== id)),
    removeChapter: (chapter) => setFavorites((prev) => prev.filter((f) => f.chapter !== chapter)),
    renameFavorite: (id, name) =>
      setFavorites((prev) => prev.map((f) => (f.id === id ? { ...f, name: name.trim() } : f))),
    isFavorited: (chapter) => favorites.some((f) => f.chapter === chapter),
    reorderFavorites: (orderedIds) =>
      setFavorites((prev) => {
        const byId = new Map(prev.map((f) => [f.id, f]));
        const next = orderedIds.map((id) => byId.get(id)).filter(Boolean) as FavoritePerek[];
        // Safety: keep any favorite not present in the provided order.
        for (const f of prev) if (!orderedIds.includes(f.id)) next.push(f);
        return next;
      }),
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};
