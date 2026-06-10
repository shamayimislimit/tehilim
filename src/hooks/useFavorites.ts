import { useProgress } from '@/context/progress';

/**
 * Favorites now live in ProgressProvider (namespaced per instance, synced to the
 * server when logged in). This hook keeps its original signature so existing
 * consumers don't change.
 */
export const useFavorites = () => {
  const { favorites, addFavorite, removeFavorite, removeChapter, renameFavorite, isFavorited, reorderFavorites } = useProgress();
  return { favorites, addFavorite, removeFavorite, removeChapter, renameFavorite, isFavorited, reorderFavorites };
};
