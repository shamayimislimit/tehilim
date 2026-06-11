#!/usr/bin/env node
/**
 * Per-instance link-preview generator.
 *
 * Link-preview crawlers (WhatsApp, iMessage, Facebook, Telegram…) do NOT run
 * JavaScript — they read only the static HTML. Every Tehilim dedication is the
 * same SPA served from one index.html, so without this step they ALL preview
 * with the default Open Graph image. The runtime PWA manifest/icon we set in JS
 * is invisible to crawlers.
 *
 * This takes the freshly deployed default `index.html` and writes a per-slug
 * copy at `<dir>/<slug>/index.html` with that instance's title / dedication /
 * image baked into the <title> + OG/Twitter meta (absolute URLs, as crawlers
 * require). nginx `try_files $uri $uri/ …` then serves that file for
 * `/tehilim/<slug>/`. The default index.html is also rewritten in place so its
 * own OG image becomes an absolute URL.
 *
 * Re-run after every frontend deploy (asset hashes change each build, and the
 * deploy wipes everything except instances/). It is data-driven: any instance
 * in tehilim_instances automatically gets a preview, no code change.
 *
 * Usage: node gen-instance-previews.mjs <htmlDir> <origin> <instancesJsonPath>
 *   htmlDir           e.g. /opt/app/html/tehilim
 *   origin            e.g. https://shamayimislimit.com
 *   instancesJsonPath JSON array of {slug,title_he,dedication_he,short_name,icon_url,...}
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const [, , htmlDir, origin, jsonPath] = process.argv;
if (!htmlDir || !origin || !jsonPath) {
  console.error('usage: gen-instance-previews.mjs <htmlDir> <origin> <instancesJsonPath>');
  process.exit(1);
}

const ORIGIN = origin.replace(/\/$/, '');
const abs = (u) => (!u ? u : /^https?:\/\//.test(u) ? u : ORIGIN + (u.startsWith('/') ? u : '/' + u));
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const defaultHtmlPath = join(htmlDir, 'index.html');
const baseHtml = readFileSync(defaultHtmlPath, 'utf8');

/** Replace, or insert before </head>, a <meta property="…"> tag. */
function setProp(html, prop, value) {
  const re = new RegExp(`(<meta property="${prop}" content=")[^"]*(")`);
  if (re.test(html)) return html.replace(re, `$1${esc(value)}$2`);
  return html.replace('</head>', `    <meta property="${prop}" content="${esc(value)}" />\n  </head>`);
}
/** Replace, or insert, a <meta name="…"> tag. */
function setName(html, name, value) {
  const re = new RegExp(`(<meta name="${name}" content=")[^"]*(")`);
  if (re.test(html)) return html.replace(re, `$1${esc(value)}$2`);
  return html.replace('</head>', `    <meta name="${name}" content="${esc(value)}" />\n  </head>`);
}
function setTitle(html, value) {
  return html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(value)}</title>`);
}
/** Point every favicon / apple-touch-icon <link> at the instance image. */
function setIcons(html, image) {
  return html
    .replace(/(<link rel="icon"[^>]*href=")[^"]*(")/g, `$1${image}$2`)
    .replace(/(<link rel="apple-touch-icon"[^>]*href=")[^"]*(")/g, `$1${image}$2`);
}
/** Point every <link rel="manifest"> at the per-instance manifest. */
function setManifest(html, href) {
  return html.replace(/(<link rel="manifest"[^>]*href=")[^"]*(")/g, `$1${href}$2`);
}

function render({ title, description, image, url, appTitle, manifestHref }) {
  let h = baseHtml;
  h = setTitle(h, title);
  h = setIcons(h, image);
  if (manifestHref) h = setManifest(h, manifestHref);
  h = setName(h, 'description', description);
  h = setName(h, 'apple-mobile-web-app-title', appTitle);
  h = setProp(h, 'og:type', 'website');
  h = setProp(h, 'og:title', title);
  h = setProp(h, 'og:description', description);
  h = setProp(h, 'og:image', image);
  h = setProp(h, 'og:image:width', '512');
  h = setProp(h, 'og:image:height', '512');
  h = setProp(h, 'og:url', url);
  h = setName(h, 'twitter:card', 'summary');
  h = setName(h, 'twitter:title', title);
  h = setName(h, 'twitter:description', description);
  h = setName(h, 'twitter:image', image);
  return h;
}

// 1) Default instance: just make its existing OG image absolute + add og:url.
{
  const url = `${ORIGIN}/tehilim/`;
  let h = baseHtml;
  h = setProp(h, 'og:image', abs('/tehilim/app-icon.png'));
  h = setName(h, 'twitter:image', abs('/tehilim/app-icon.png'));
  h = setProp(h, 'og:url', url);
  writeFileSync(defaultHtmlPath, h);
  console.log(`default -> ${defaultHtmlPath} (og:image absolutised)`);
}

// 2) Named instances from the DB.
const instances = JSON.parse(readFileSync(jsonPath, 'utf8') || '[]');
for (const it of instances) {
  if (!it.slug) continue; // '' = default, handled above
  const title = [it.title_he, it.dedication_he].filter(Boolean).join(' · ');
  const description = it.dedication_he || it.title_he || 'תהילים';
  const image = abs(it.icon_url || '/tehilim/app-icon.png');
  const url = `${ORIGIN}/tehilim/${it.slug}/`;
  const dir = join(htmlDir, it.slug);
  mkdirSync(dir, { recursive: true });

  // Per-instance manifest so "Add to Home Screen" launches THIS instance
  // (start_url/scope with the slug) — not the default app. iOS reads this at
  // install time; without it the home-screen icon opens /tehilim/.
  const scope = `/tehilim/${it.slug}/`;
  const iconSrc = it.icon_url || '/tehilim/app-icon.png';
  const manifestHref = `${scope}manifest.webmanifest`;
  const manifest = {
    id: scope,
    name: title,
    short_name: it.short_name || 'Tehilim',
    start_url: scope,
    scope,
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: it.theme_color || '#3b5bdb',
    icons: [
      { src: iconSrc, sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: iconSrc, sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: iconSrc, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
  writeFileSync(join(dir, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2));
  writeFileSync(join(dir, 'index.html'), render({ title, description, image, url, appTitle: it.short_name || 'Tehilim', manifestHref }));
  console.log(`${it.slug} -> index.html + manifest.webmanifest (start_url=${scope}, icon=${iconSrc})`);
}
