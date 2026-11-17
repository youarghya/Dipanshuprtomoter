import { env } from './env.js';

/**
 * Load Google Analytics only when a measurement ID is configured.
 * Respects the browser "Do Not Track" setting and loads nothing
 * when VITE_GA_MEASUREMENT_ID is empty.
 */
export function initAnalytics() {
  const id = env.analyticsId;
  if (!id || typeof window === 'undefined' || typeof document === 'undefined') return;
  if (navigator.doNotTrack === '1') return;
  if (window.gtag) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', id, { anonymize_ip: true });
}
