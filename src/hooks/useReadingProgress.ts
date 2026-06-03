import { useState, useEffect, useMemo } from 'react';

const STORAGE_KEY = 'tehilim-progress';

interface ProgressShape {
  read: number[]; // chapter numbers marked as read
  cycleStartedAt?: number;
}

const readStored = (): ProgressShape => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { read: [] };
    const parsed = JSON.parse(raw);
    return { read: Array.isArray(parsed?.read) ? parsed.read : [], cycleStartedAt: parsed?.cycleStartedAt };
  } catch {
    return { read: [] };
  }
};

export const useReadingProgress = () => {
  const [progress, setProgress] = useState<ProgressShape>(() => readStored());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      /* ignored */
    }
  }, [progress]);

  const readSet = useMemo(() => new Set(progress.read), [progress.read]);

  const markRead = (chapter: number) =>
    setProgress((p) => ({
      ...p,
      read: p.read.includes(chapter) ? p.read : [...p.read, chapter],
      cycleStartedAt: p.cycleStartedAt ?? Date.now(),
    }));

  const markUnread = (chapter: number) =>
    setProgress((p) => ({ ...p, read: p.read.filter((c) => c !== chapter) }));

  const toggleRead = (chapter: number) =>
    readSet.has(chapter) ? markUnread(chapter) : markRead(chapter);

  const reset = () => setProgress({ read: [] });

  const isRead = (chapter: number) => readSet.has(chapter);

  return { progress, isRead, markRead, markUnread, toggleRead, reset };
};
