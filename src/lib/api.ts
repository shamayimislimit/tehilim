import { InstanceConfig } from '@/instances/registry';
import { FavoritePerek, TehilimSettings } from '@/types/tehilim';

/**
 * Backend lives at the same origin under /api (nginx proxies to the Express
 * service). VITE_API_URL can override it for local dev against a remote API.
 */
const API_BASE = import.meta.env.VITE_API_URL || '';

export interface ServerProgress {
  settings: Partial<TehilimSettings> | null;
  favorites: FavoritePerek[] | null;
  lastRead: Record<string, unknown> | null;
}

const authHeaders = (token: string) => ({ Authorization: `Bearer ${token}` });

/** Send a magic-link email. `redirect` is the full URL to return to after login. */
export async function requestMagicLink(email: string, redirect: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/tehilim/auth/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, redirect }),
  });
  if (!res.ok) throw new Error(`auth/request failed: ${res.status}`);
}

export async function fetchMe(token: string): Promise<{ id: string; email: string } | null> {
  const res = await fetch(`${API_BASE}/api/tehilim/me`, { headers: authHeaders(token) });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`me failed: ${res.status}`);
  return (await res.json()).user;
}

/** Fetch a named instance's config. Returns null on 404. */
export async function fetchInstance(slug: string): Promise<InstanceConfig | null> {
  const res = await fetch(`${API_BASE}/api/tehilim/instances?slug=${encodeURIComponent(slug)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`instances failed: ${res.status}`);
  return (await res.json()).instance as InstanceConfig;
}

export async function getProgress(token: string, slug: string): Promise<ServerProgress | null> {
  const res = await fetch(`${API_BASE}/api/tehilim/progress?slug=${encodeURIComponent(slug)}`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(`progress GET failed: ${res.status}`);
  return (await res.json()).progress;
}

export async function putProgress(
  token: string,
  slug: string,
  data: { settings: TehilimSettings; favorites: FavoritePerek[]; lastRead?: Record<string, unknown> }
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/tehilim/progress`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify({ slug, ...data }),
  });
  if (!res.ok) throw new Error(`progress PUT failed: ${res.status}`);
}
