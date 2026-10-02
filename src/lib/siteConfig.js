/**
 * Configuración del sitio inyectada desde el entorno de build.
 * Reemplaza al `js/config.js` que generaba scripts/gen-config.mjs:
 * ahora Vite expone las variables como import.meta.env.
 *
 * Configurá en `.env.local` (no se commitea) o en el panel de Vercel:
 *   VITE_SITE_URL=https://nexorastudio.com
 *   VITE_ANALYTICS_ID=G-XXXXXXXXXX
 */
const env = import.meta.env;

export const SITE_CONFIG = {
  siteUrl: env.VITE_SITE_URL || 'https://nexorastudio.com',
  analyticsId: env.VITE_ANALYTICS_ID || '',
};
