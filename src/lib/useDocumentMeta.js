import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { metaFor } from '../data/seo';
import { ROUTE_PATHS } from '../manifest';
import { SITE_CONFIG } from './siteConfig';

const setTag = (selector, attrs) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
};

/**
 * Aplica title, description, canonical y Open Graph según la ruta y el
 * idioma. Sin esto, la SPA deja el mismo title en las 8 rutas.
 */
export default function useDocumentMeta() {
  const { pathname } = useLocation();
  const { lang } = useLang();

  useEffect(() => {
    const { title, description } = metaFor(pathname, lang);

    document.title = title;
    document.documentElement.lang = lang;

    setTag('meta[name="description"]', { name: 'description', content: description });
    setTag('meta[property="og:title"]', { property: 'og:title', content: title });
    setTag('meta[property="og:description"]', { property: 'og:description', content: description });
    setTag('meta[property="og:url"]', { property: 'og:url', content: `${SITE_CONFIG.siteUrl}${pathname}` });
    setTag('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    setTag('meta[name="twitter:description"]', { name: 'twitter:description', content: description });

    setTag('link[rel="canonical"]', { rel: 'canonical', href: `${SITE_CONFIG.siteUrl}${pathname}` });

    // Una URL desconocida (el 404) no debe indexarse: si lo hiciera,
    // Google la tomaría como contenido duplicado del sitio.
    const isKnownRoute = ROUTE_PATHS.includes(pathname);
    setTag('meta[name="robots"]', {
      name: 'robots',
      content: isKnownRoute ? 'index, follow' : 'noindex, follow',
    });
  }, [pathname, lang]);
}
