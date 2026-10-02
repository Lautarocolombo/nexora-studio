import { SITE_CONFIG } from './siteConfig';

/**
 * GA4 opcional: solo carga si hay VITE_ANALYTICS_ID configurado.
 * Si no está, no hace nada (ni red, ni cookies).
 */
export function initAnalytics() {
  const id = SITE_CONFIG.analyticsId;
  if (!id) return;

  try {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', id, { anonymize_ip: true });

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  } catch {
    // Si el navegador bloquea el script, el sitio sigue funcionando.
  }
}
