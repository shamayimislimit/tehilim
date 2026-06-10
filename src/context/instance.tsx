import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { InstanceConfig, resolveInstance } from '@/instances/registry';
import { fetchInstance } from '@/lib/api';
import { ProgressProvider } from '@/context/progress';
import NotFound from '@/pages/NotFound';

const InstanceContext = createContext<InstanceConfig | null>(null);

/** Current instance (dedication, title, icon…). Throws if used outside the provider. */
export const useInstance = (): InstanceConfig => {
  const ctx = useContext(InstanceContext);
  if (!ctx) throw new Error('useInstance must be used inside an InstanceRoute');
  return ctx;
};

/**
 * Slug-aware link builder. Every internal link goes through this so it stays
 * within the current dedication:
 *   default instance  → iLink('/week/1') === '/week/1'
 *   "papy-jacky"       → iLink('/week/1') === '/papy-jacky/week/1'
 */
export const useInstanceLink = () => {
  const { slug } = useInstance();
  return useMemo(() => {
    const prefix = slug ? `/${slug}` : '';
    return (path: string) => (path === '/' ? prefix || '/' : `${prefix}${path}`);
  }, [slug]);
};

/**
 * Per-instance PWA wiring for NAMED instances: a runtime-generated manifest
 * (blob URL) so "Add to Home Screen" pins this dedication's icon + its own
 * start_url, plus a dynamic apple-touch-icon for iOS. The default instance
 * keeps its build-time manifest (already correct), so we no-op there.
 */
const InstancePwa = ({ instance }: { instance: InstanceConfig }) => {
  useEffect(() => {
    if (!instance.slug || !instance.iconPath) return;
    const base = import.meta.env.BASE_URL; // '/tehilim/'
    const scope = `${base}${instance.slug}/`;
    const icon = instance.iconPath;

    const manifest = {
      name: `${instance.shortName} — ${instance.dedication.french || instance.slug}`,
      short_name: instance.shortName,
      start_url: scope,
      scope,
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: instance.themeColor || '#3b5bdb',
      icons: [
        { src: icon, sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: icon, sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: icon, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    };

    const blob = new Blob([JSON.stringify(manifest)], { type: 'application/manifest+json' });
    const blobUrl = URL.createObjectURL(blob);

    const setLink = (rel: string, href: string, attrs: Record<string, string> = {}) => {
      const prev = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
      const prevHref = prev?.getAttribute('href') ?? null;
      const el = prev ?? document.createElement('link');
      el.setAttribute('rel', rel);
      el.setAttribute('href', href);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      if (!prev) document.head.appendChild(el);
      return { el, prevHref, created: !prev };
    };

    const manifestLink = setLink('manifest', blobUrl);
    const appleIcon = setLink('apple-touch-icon', icon);

    // Browser-tab favicon → the instance icon. There are several rel="icon"
    // links (favicon.ico, 16, 32); point them all at the instance icon. Covers
    // client-side navigation and deep-links that fall back to the default HTML.
    const iconLinks = Array.from(document.head.querySelectorAll<HTMLLinkElement>('link[rel="icon"]'));
    const prevIconHrefs = iconLinks.map((el) => el.getAttribute('href'));
    iconLinks.forEach((el) => el.setAttribute('href', icon));

    const themeMeta = document.head.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const prevTheme = themeMeta?.getAttribute('content') ?? null;
    if (themeMeta && manifest.theme_color) themeMeta.setAttribute('content', manifest.theme_color);

    const prevTitle = document.title;
    document.title = manifest.name;

    return () => {
      // Restore the default manifest/icon when leaving a named instance.
      if (manifestLink.prevHref) manifestLink.el.setAttribute('href', manifestLink.prevHref);
      else manifestLink.el.remove();
      if (appleIcon.created) appleIcon.el.remove();
      else if (appleIcon.prevHref) appleIcon.el.setAttribute('href', appleIcon.prevHref);
      iconLinks.forEach((el, i) => {
        const prev = prevIconHrefs[i];
        if (prev) el.setAttribute('href', prev);
      });
      if (themeMeta && prevTheme) themeMeta.setAttribute('content', prevTheme);
      document.title = prevTitle;
      URL.revokeObjectURL(blobUrl);
    };
  }, [instance]);

  return null;
};

const Provide = ({ instance, children }: { instance: InstanceConfig; children: ReactNode }) => (
  <InstanceContext.Provider value={instance}>
    <InstancePwa instance={instance} />
    <ProgressProvider slug={instance.slug}>{children}</ProgressProvider>
  </InstanceContext.Provider>
);

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
  </div>
);

/**
 * Resolves the instance from the `:instance` route param. Default instance
 * (no param) comes from the bundled registry; named slugs are fetched from the
 * API. Unknown slug → 404.
 */
export const InstanceRoute = () => {
  const { instance: slugParam } = useParams();
  const local = resolveInstance(slugParam);
  const [remote, setRemote] = useState<InstanceConfig | null | undefined>(undefined);

  useEffect(() => {
    if (local) return; // default / bundled instance, no fetch needed
    let cancelled = false;
    setRemote(undefined);
    fetchInstance(slugParam as string)
      .then((inst) => !cancelled && setRemote(inst))
      .catch(() => !cancelled && setRemote(null));
    return () => {
      cancelled = true;
    };
  }, [slugParam, local]);

  if (local) {
    return (
      <Provide instance={local}>
        <Outlet />
      </Provide>
    );
  }
  if (remote === undefined) return <Loading />;
  if (remote === null) return <NotFound />;
  return (
    <Provide instance={remote}>
      <Outlet />
    </Provide>
  );
};
