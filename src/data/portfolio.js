/**
 * NEXORA STUDIO — Portfolio data
 * ─────────────────────────────────────────────────────────
 * Las imágenes se cargan automáticamente con `import.meta.glob`
 * desde `src/assets/portfolio/<slug>/*.jpg`. No hace falta escribir
 * ninguna ruta a mano: con crear la subcarpeta y agregar la entrada
 * del proyecto abajo, el sitio lo toma solo.
 *
 * Para agregar un proyecto nuevo:
 *   1. Copiá las capturas en  src/assets/portfolio/<slug>/
 *      (numeradas: 1.jpg, 2.jpg, ... para que ordenen bien)
 *   2. Agregá un objeto a PROJECTS con `slug: '<slug>'` y su metadata.
 */

const imageModules = import.meta.glob('/src/assets/portfolio/*/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
});

/** Orden natural: 2.jpg va antes de 10.jpg (no 10 antes de 2). */
const collator = new Intl.Collator('es', { numeric: true, sensitivity: 'base' });

/**
 * Devuelve las imágenes de un proyecto, ordenadas alfabéticamente/numéricamente.
 * El `alt` lo arma cada proyecto con su propio `altFor`, para que sea
 * texto real y descriptivo (SEO + lectores de pantalla).
 */
function galleryFor(slug, altFor) {
  const prefix = `/src/assets/portfolio/${slug}/`;

  const files = Object.entries(imageModules)
    .filter(([path]) => path.startsWith(prefix))
    .map(([path, src]) => ({ file: path.slice(prefix.length), src }))
    .sort((a, b) => collator.compare(a.file, b.file));

  return files.map((image, index) => ({
    src: image.src,
    alt: altFor(index, files.length),
  }));
}

/**
 * ÚNICO ARCHIVO A EDITAR PARA AGREGAR O MODIFICAR PROYECTOS.
 */
const PROJECT_DEFS = [
  {
    slug: 'metagro',
    category: 'si',
    name: { es: 'Metagro SRL', en: 'Metagro SRL' },
    type: { es: 'Sistema corporativo', en: 'Corporate system' },
    desc: {
      es: 'Sitio bilingüe con catálogo de productos, panel de administración y gestión de stock para una empresa de insumos agropecuarios.',
      en: 'Bilingual site with product catalog, admin panel and stock management for an agribusiness supplies company.',
    },
    tags: {
      es: ['Node.js', 'PostgreSQL', 'Panel admin'],
      en: ['Node.js', 'PostgreSQL', 'Admin panel'],
    },
    link: null,
    altFor: (i, total) => `Metagro SRL — captura ${i + 1} de ${total} del sitio web`,
  },
  {
    slug: 'artesanias',
    category: 'ec',
    name: { es: 'Artesanías Gualeguay', en: 'Artesanías Gualeguay' },
    type: { es: 'Tienda online', en: 'Online store' },
    desc: {
      es: 'E-commerce para un taller de artesanía local: catálogo de productos, carrito de compras y medios de pago para ventas locales y online.',
      en: 'E-commerce for a local craft workshop: product catalog, shopping cart and payment methods for local and online sales.',
    },
    tags: {
      es: ['E-commerce', 'Carrito', 'Pagos'],
      en: ['E-commerce', 'Cart', 'Payments'],
    },
    link: null,
    altFor: (i, total) => `Artesanías Gualeguay — captura ${i + 1} de ${total} de la tienda online`,
  },
];

export const PROJECTS = PROJECT_DEFS.map((def) => ({
  ...def,
  images: galleryFor(def.slug, def.altFor),
}));

/** Texto de un campo bilingüe según el idioma activo. */
export const t = (field, lang) => {
  if (field == null) return '';
  if (typeof field === 'string') return field;
  return field[lang] ?? field.es;
};

/** Texto del nombre completo en el idioma activo. */
export const projectName = (project, lang) => t(project.name, lang);
export const projectType = (project, lang) => t(project.type, lang);
export const projectDesc = (project, lang) => t(project.desc, lang);
// `t` ya devuelve '' cuando la lista falta, y el consumidor trata '' como
// falsy, así que no hace falta un ?? [] que además mezcla tipos.
export const projectTags = (project, lang) => t(project.tags, lang);
