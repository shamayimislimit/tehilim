import { useState, useEffect, useMemo } from 'react';
import { FavoriteVerse } from '@/types/tehilim';

const STORAGE_KEY = 'tehilim-favorites';

const readStored = (): FavoriteVerse[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteVerse[]>(() => readStored());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      /* ignored */
    }
  }, [favorites]);

  const addFavorite = (chapter: number, verse: number, collection: string) => {
    const trimmed = collection.trim() || 'Favoris';
    setFavorites((prev) => [
      ...prev,
      { id: uid(), chapter, verse, collection: trimmed, addedAt: Date.now() },
    ]);
  };

  const removeFavorite = (id: string) =>
    setFavorites((prev) => prev.filter((f) => f.id !== id));

  const renameCollection = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setFavorites((prev) => prev.map((f) => (f.collection === oldName ? { ...f, collection: trimmed } : f)));
  };

  const deleteCollection = (collection: string) =>
    setFavorites((prev) => prev.filter((f) => f.collection !== collection));

  const isFavorited = (chapter: number, verse: number) =>
    favorites.some((f) => f.chapter === chapter && f.verse === verse);

  const collections = useMemo(() => {
    const map = new Map<string, FavoriteVerse[]>();
    for (const f of favorites) {
      const arr = map.get(f.collection) ?? [];
      arr.push(f);
      map.set(f.collection, arr);
    }
    return Array.from(map.entries())
      .map(([name, items]) => ({ name, items: items.sort((a, b) => a.chapter - b.chapter || a.verse - b.verse) }))
      .sort((a, b) => a.name.localeCompare(b.name, 'he'));
  }, [favorites]);

  const knownCollectionNames = useMemo(
    () => Array.from(new Set(favorites.map((f) => f.collection))).sort(),
    [favorites]
  );

  return {
    favorites,
    collections,
    knownCollectionNames,
    addFavorite,
    removeFavorite,
    renameCollection,
    deleteCollection,
    isFavorited,
  };
};
