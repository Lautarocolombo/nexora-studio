import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Services from './pages/Services';
import About from './pages/About';
import AboutMe from './pages/AboutMe';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import { NAV_ITEMS, ROUTE_PATHS } from './manifest';

/**
 * Asocia cada ruta del manifiesto con su componente.
 * La lista de rutas vive en `manifest.js` (datos puros) para que los tests
 * puedan validarla sin cargar los componentes.
 */
const COMPONENTS = {
  '/': Home,
  '/nosotros': About,
  '/yo': AboutMe,
  '/servicios': Services,
  '/portfolio': Portfolio,
  '/contacto': Contact,
  '/privacidad': Privacy,
  '/terminos': Terms,
};

export const ROUTES = ROUTE_PATHS.map((path) => ({ path, Component: COMPONENTS[path] }));

/** Rutas que se muestran en el navbar. */
export const NAV_ROUTES = NAV_ITEMS.map((item) => ({ ...item, Component: COMPONENTS[item.path] }));
