import { useMemo, useState } from 'react';
import ProjectTabs from './ProjectTabs';
import ProjectViewer from './ProjectViewer';
import { projectDesc, projectName, projectTags, projectType } from '../../data/portfolio';

/** Textos visibles de la sección, en ambos idiomas. */
const STRINGS = {
  es: {
    tabsLabel: 'Proyectos',
    thumbnailsLabel: 'Miniaturas',
    carousel: 'carrusel',
    screenshots: 'capturas del proyecto',
    lightboxLabel: 'Visor de imagen',
    prev: 'Imagen anterior',
    next: 'Imagen siguiente',
    close: 'Cerrar visor',
    goTo: 'Ir a la imagen',
    showImage: 'Ver imagen',
    expand: 'Ampliar imagen',
    viewProject: 'Ver proyecto',
    tech: 'Tecnologías',
    noImages: 'Pronto vas a ver las capturas de este proyecto.',
  },
  en: {
    tabsLabel: 'Projects',
    thumbnailsLabel: 'Thumbnails',
    carousel: 'carousel',
    screenshots: 'project screenshots',
    lightboxLabel: 'Image viewer',
    prev: 'Previous image',
    next: 'Next image',
    close: 'Close viewer',
    goTo: 'Go to image',
    showImage: 'View image',
    expand: 'Expand image',
    viewProject: 'View project',
    tech: 'Technologies',
    noImages: 'Screenshots for this project are coming soon.',
  },
};

/**
 * Sección "Nuestros trabajos": pestañas por proyecto + visor embebido
 * + texto real (nombre, descripción, tags) del proyecto activo.
 *
 * `headingLevel` permite que la página /portfolio la use como <h1> y que
 * en la home quede como <h2>, sin duplicar el componente.
 */
export default function ProjectShowcase({ projects, lang = 'es', headingLevel = 2 }) {
  const t = useMemo(() => STRINGS[lang] ?? STRINGS.es, [lang]);
  const withImages = useMemo(() => projects.filter((p) => p.images?.length > 0), [projects]);
  const [activeSlug, setActiveSlug] = useState(withImages[0]?.slug);
  const Heading = `h${headingLevel}`;
  // El nombre del proyecto cuelga del título de la sección: si la sección es
  // h1 (página /portfolio) el nombre debe ser h2, no h3, o se salta un nivel.
  const NameHeading = `h${headingLevel + 1}`;

  if (!withImages.length) return null;

  const active = withImages.find((p) => p.slug === activeSlug) ?? withImages[0];
  const tags = projectTags(active, lang);

  return (
    <section id="trabajos" aria-labelledby="trabajos-title" className="relative py-24 lg:py-28">
      <div className="container-x">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="section-label justify-center">{t.tabsLabel === 'Proyectos' ? 'Portafolio' : 'Portfolio'}</p>
          <Heading id="trabajos-title" className="section-title mt-3">
            {lang === 'es' ? 'Nuestros trabajos' : 'Our work'}
          </Heading>
          <p className="section-desc mt-4">
            {lang === 'es'
              ? 'Elegí un proyecto y recorré todas sus pantallas acá mismo, sin descargas ni esperas.'
              : 'Pick a project and browse every screen right here, no downloads required.'}
          </p>
        </div>

        <ProjectTabs
          projects={withImages}
          activeSlug={active.slug}
          onSelect={setActiveSlug}
          lang={lang}
          t={t}
        />

        {/* El id lo referencian los tabs vía aria-controls */}
        <div
          id="project-viewer-panel"
          role="tabpanel"
          aria-labelledby={`project-tab-${active.slug}`}
          className="mx-auto max-w-5xl"
        >
          {active.images?.length ? (
            <ProjectViewer key={active.slug} project={active} lang={lang} t={t} />
          ) : (
            <p className="surface-card p-8 text-center text-ink-2">{t.noImages}</p>
          )}

          {/* Texto real del proyecto activo: SEO y accesibilidad */}
          <div className="mt-10 text-center">
            <p className="section-label justify-center">{projectType(active, lang)}</p>
            <NameHeading className="mt-3 font-heading text-2xl font-bold text-ink sm:text-3xl">
              {projectName(active, lang)}
            </NameHeading>
            <p className="mx-auto mt-4 max-w-2xl text-ink-2">{projectDesc(active, lang)}</p>

            {tags.length ? (
              <ul
                aria-label={t.tech}
                className="mt-6 flex flex-wrap items-center justify-center gap-2"
              >
                {tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-line-accent bg-card px-3.5 py-1.5 text-xs font-medium text-ink-2"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}

            {active.link ? (
              <a
                href={active.link}
                className="btn btn-primary mt-8"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.viewProject}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
