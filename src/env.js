/**
 * Public runtime configuration.
 *
 * Only values prefixed with VITE_ are exposed by Vite, and all of
 * them end up in the browser bundle. Never place secrets here.
 */

const raw = import.meta.env;

function trimTrailingSlashes(value) {
  return String(value || '')
    .trim()
    .replace(/\/+$/, '');
}

export const env = {
  mode: raw.MODE,
  isDev: Boolean(raw.DEV),
  isProd: Boolean(raw.PROD),
  siteUrl: trimTrailingSlashes(raw.VITE_SITE_URL),
  basePath: raw.BASE_URL || '/',
  analyticsId: String(raw.VITE_GA_MEASUREMENT_ID || '').trim(),
  version: typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.0.0',
};

/** Absolute canonical URL for the deployed site, or '' when unset. */
export function canonicalUrl() {
  if (!env.siteUrl) return '';
  return `${env.siteUrl}${env.basePath}`;
}

const ABSOLUTE_URL = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

/**
 * Resolve a public asset path against the configured base path.
 * Absolute and data/blob URLs are returned untouched, so this is
 * safe to apply to any image source.
 */
export function assetUrl(path) {
  if (!path) return '';
  const value = String(path);
  if (ABSOLUTE_URL.test(value)) return value;

  const base = env.basePath.endsWith('/') ? env.basePath : `${env.basePath}/`;
  if (value.startsWith(base)) return value;

  return `${base}${value.replace(/^\/+/, '')}`;
}
