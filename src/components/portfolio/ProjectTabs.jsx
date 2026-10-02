/**
 * Pestañas de filtro por proyecto, con semántica ARIA de tablist.
 * Las flechas ← / → recorren las pestañas (patrón WAI-ARIA Tabs).
 */
export default function ProjectTabs({ projects, activeSlug, onSelect, lang, t }) {
  const onKeyDown = (event) => {
    const last = projects.length - 1;
    const activeIndex = projects.findIndex((project) => project.slug === activeSlug);
    let next = null;
    if (event.key === 'ArrowRight') next = activeIndex >= last ? 0 : activeIndex + 1;
    else if (event.key === 'ArrowLeft') next = activeIndex <= 0 ? last : activeIndex - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;
    if (next === null) return;
    event.preventDefault();
    const slug = projects[next].slug;
    onSelect(slug);
    document.getElementById(`project-tab-${slug}`)?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label={t?.tabsLabel ?? 'Proyectos'}
      onKeyDown={onKeyDown}
      className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-3"
    >
      {projects.map((project) => {
        const isActive = project.slug === activeSlug;
        return (
          <button
            key={project.slug}
            id={`project-tab-${project.slug}`}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-controls="project-viewer-panel"
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelect(project.slug)}
            className={`rounded-md border px-5 py-2.5 font-heading text-sm font-semibold transition-all duration-300 ${
              isActive
                ? 'border-transparent bg-gradient-to-br from-brand to-accent-jade text-brand-ink shadow-glow'
                : 'border-line bg-card text-ink-2 hover:border-line-accent hover:text-ink'
            }`}
          >
            {project.name?.[lang] ?? project.slug}
            <span className="ml-2 text-xs font-normal">{project.images.length}</span>
          </button>
        );
      })}
    </div>
  );
}
