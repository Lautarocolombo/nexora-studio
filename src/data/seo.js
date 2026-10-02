import { ROUTE_PATHS } from '../manifest.js';

/**
 * SEO por ruta: title y description en es/en.
 *
 * Al ser una SPA, el <title> del index.html es único para todo el sitio;
 * sin esto, Google vería la misma página en las 8 rutas (thin content).
 * `useDocumentMeta` los aplica en cada navegación.
 */
export const META = {
  '/': {
    es: {
      title: 'Nexora Studio — Transformamos ideas en soluciones digitales',
      description:
        'Diseño y desarrollo web a medida para PyMEs y emprendedores del interior. Sitios, e-commerce y sistemas, sin plantillas y con código propio.',
    },
    en: {
      title: 'Nexora Studio — We turn ideas into digital solutions',
      description:
        'Custom web design and development for SMEs and entrepreneurs. Websites, e-commerce and systems, no templates, owned code.',
    },
  },
  '/nosotros': {
    es: {
      title: 'Nosotros — Nexora Studio',
      description:
        'Un estudio digital del interior del país: diseño propio, código limpio, acompañamiento cercano y precios transparentes en dólares.',
    },
    en: {
      title: 'About us — Nexora Studio',
      description:
        'A digital studio from the heartland: custom design, clean code, close accompaniment and transparent prices.',
    },
  },
  '/yo': {
    es: {
      title: 'Sobre mí — Damian Richard | Nexora Studio',
      description:
        'Desarrollador web full stack. React, Next.js, Node.js, PostgreSQL y despliegue en la nube.',
    },
    en: {
      title: 'About me — Damian Richard | Nexora Studio',
      description:
        'Full stack web developer working with React, Next.js, Node.js, PostgreSQL and cloud deployments.',
    },
  },
  '/servicios': {
    es: {
      title: 'Servicios web a medida — Nexora Studio',
      description:
        'Landing pages, sitios corporativos, tiendas online y sistemas a medida. Precios desde USD 350 y entrega en 3 a 18 días.',
    },
    en: {
      title: 'Custom web services — Nexora Studio',
      description:
        'Landing pages, corporate sites, online stores and custom systems. From USD 350, delivered in 3 to 18 days.',
    },
  },
  '/portfolio': {
    es: {
      title: 'Nuestros trabajos — Nexora Studio',
      description:
        'Recorré las pantallas de nuestros proyectos terminados: sistemas corporativos y tiendas online, sin descargas.',
    },
    en: {
      title: 'Our work — Nexora Studio',
      description:
        'Browse the screens of our finished projects: corporate systems and online stores. No downloads needed.',
    },
  },
  '/contacto': {
    es: {
      title: 'Contacto — Nexora Studio',
      description:
        'Contanos tu proyecto y recibí una propuesta a medida. Cotización sin compromiso y respuesta en menos de 24 horas.',
    },
    en: {
      title: 'Contact — Nexora Studio',
      description:
        'Tell us about your project and get a custom proposal. No-obligation quote, reply within 24 hours.',
    },
  },
  '/privacidad': {
    es: {
      title: 'Política de Privacidad — Nexora Studio',
      description:
        'Qué datos manejamos, con qué finalidad y cómo ejercer tus derechos, conforme a la Ley 25.326 de Protección de Datos Personales.',
    },
    en: {
      title: 'Privacy Policy — Nexora Studio',
      description:
        'What data we handle, why we handle it and how to exercise your rights under Argentina’s Personal Data Protection Law.',
    },
  },
  '/terminos': {
    es: {
      title: 'Términos de Servicio — Nexora Studio',
      description:
        'Condiciones de contratación: alcance, presupuestos, plazos, propiedad intelectual y limitación de responsabilidad.',
    },
    en: {
      title: 'Terms of Service — Nexora Studio',
      description:
        'Engagement terms: scope, quotes, timelines, intellectual property and limitation of liability.',
    },
  },
};

/** Metadata de la página 404. */
export const NOT_FOUND_META = {
  es: {
    title: 'Página no encontrada — Nexora Studio',
    description: 'La página que buscás no existe o fue movida.',
  },
  en: {
    title: 'Page not found — Nexora Studio',
    description: 'The page you are looking for does not exist or has been moved.',
  },
};

/** Devuelve la metadata de una ruta (o la del 404 si no existe). */
export const metaFor = (pathname, lang) => {
  const key = ROUTE_PATHS.includes(pathname) ? pathname : null;
  return (key ? META[key] : NOT_FOUND_META)[lang] ?? META['/'][lang];
};
