import { useProgress } from '@/context/progress';

/**
 * Settings now live in ProgressProvider (namespaced per instance, synced to the
 * server when logged in). Kept as a hook for backward compatibility.
 */
export const useTehilimSettings = () => {
  const { settings, updateSettings } = useProgress();
  return { settings, updateSettings };
};
