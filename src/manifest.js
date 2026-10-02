/**
 * Manifiesto de rutas: SOLO datos, sin imports de componentes.
 *
 * Vive aparte de `routes.js` a propósito, para que los tests y cualquier
 * script de Node puedan leerlo sin pasar por Vite (`import.meta.glob`
 * solo existe durante el build).
 *
 * Al agregar una ruta: agregala acá, asociala con su componente en
 * `routes.js`, agregá el rewrite en `vercel.json` y revisá el catch-all de
 * `render.yaml`. El test `deploy.spec.ts` falla si te olvidás de alguno.
 */

/** Todas las rutas de la app, en orden de navegación. */
export const ROUTE_PATHS = [
  '/',
  '/nosotros',
  '/yo',
  '/servicios',
  '/portfolio',
  '/contacto',
  '/privacidad',
  '/terminos',
];

/** Las rutas que además aparecen en el navbar. */
export const NAV_ITEMS = [
  { path: '/', label: { es: 'Inicio', en: 'Home' } },
  { path: '/nosotros', label: { es: 'Nosotros', en: 'About' } },
  { path: '/yo', label: { es: 'Sobre mí', en: 'About me' } },
  { path: '/servicios', label: { es: 'Servicios', en: 'Services' } },
  { path: '/portfolio', label: { es: 'Portfolio', en: 'Portfolio' } },
  { path: '/contacto', label: { es: 'Contacto', en: 'Contact' } },
];
