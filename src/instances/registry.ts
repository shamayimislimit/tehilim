import config from '@/config.json';
import { Language } from '@/types/tehilim';

/**
 * An "instance" is a single dedication of the app (e.g. the default memorial,
 * or "papy-jacky"). Features are 100% shared across instances — only this
 * per-instance metadata changes. One codebase, one build, many dedications.
 *
 * Phase 1: the registry is static and only holds the default instance, so the
 * live app renders identically to before. Phase 5 swaps `resolveInstance` for
 * an API fetch against `/api/tehilim/instances/:slug` without touching callers.
 */
export interface InstanceConfig {
  /** URL slug. '' = the default instance, served at the app root (/tehilim/). */
  slug: string;
  title: Record<Language, string>;
  dedication: Record<Language, string>;
  shortName: string;
  iconPath: string;
  /** Memorial portrait shown in the Header (named instances only). */
  portrait?: string;
  /** PWA theme color (phase 2). Optional — falls back to the global theme. */
  themeColor?: string;
}

export const DEFAULT_SLUG = '';

/**
 * Slugs that can never name an instance: they collide with real route segments.
 * React Router ranks these static routes above the dynamic `:instance` segment,
 * so a dedication named "week" would be unreachable. Enforced again server-side
 * at instance-creation time (phase 4).
 */
export const RESERVED_SLUGS = new Set(['week', 'month', 'perek', 'favorites']);

const defaultInstance: InstanceConfig = {
  slug: DEFAULT_SLUG,
  title: config.app.title,
  dedication: config.dedication,
  shortName: config.app.shortName,
  iconPath: config.app.iconPath,
};

const registry: Record<string, InstanceConfig> = {
  [DEFAULT_SLUG]: defaultInstance,
};

/** Resolve an instance by slug. `undefined` slug → default instance. */
export const resolveInstance = (slug?: string): InstanceConfig | undefined =>
  registry[slug ?? DEFAULT_SLUG];
