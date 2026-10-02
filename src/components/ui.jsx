import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PROCESS, t as tr } from '../data/site';

/** Encabezado de página. */
export function PageHero({ eyebrow, title, subtitle, children }) {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-20">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow ? (
            <span className="inline-flex rounded-full border border-line-accent bg-card px-4 py-1.5 font-heading text-xs font-semibold tracking-[0.18em] text-brand-text uppercase">
              {eyebrow}
            </span>
          ) : null}
          <h1 className="mt-6 font-heading text-4xl leading-[1.1] font-bold sm:text-5xl">{title}</h1>
          {subtitle ? <p className="mt-5 text-lg text-ink-2">{subtitle}</p> : null}
          {children ? <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}

/** Título + bajada de una sección. */
export function SectionIntro({ label, title, description, className = '' }) {
  return (
    <div className={`mx-auto max-w-3xl text-center ${className}`}>
      {label ? <p className="section-label justify-center">{label}</p> : null}
      {title ? <h2 className="section-title mt-3">{title}</h2> : null}
      {description ? <p className="section-desc mt-4">{description}</p> : null}
    </div>
  );
}

/** Banda de llamada a la acción. */
export function CTABand({ lead, title, cta = '/contacto', ctaLabel }) {
  return (
    <section className="border-y border-line bg-gradient-to-br from-brand/10 via-transparent to-accent-jade/10 py-16">
      <div className="container-x flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
        <div>
          {lead ? (
            <span className="font-heading text-sm font-semibold tracking-[0.18em] text-brand-text uppercase">
              {lead}
            </span>
          ) : null}
          <h2 className="section-title mt-2">{title}</h2>
        </div>
        <Link to={cta} className="btn btn-primary shrink-0">
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}

/** Los 5 pasos del proceso. */
export function ProcessSteps({ lang }) {
  return (
    <section className="py-20">
      <div className="container-x">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {PROCESS.map((step) => (
            <li key={step.number} className="surface-card relative p-6">
              <span className="font-heading text-sm font-bold text-brand-text-text">{step.number}</span>
              <span aria-hidden="true" className="mt-3 block text-2xl">
                {step.icon}
              </span>
              <h3 className="mt-3 font-heading text-base font-semibold">{tr(step.title, lang)}</h3>
              <p className="mt-2 text-sm text-ink-2">{tr(step.desc, lang)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Acordeón de preguntas frecuentes. */
export function FAQList({ items, lang }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="divide-y divide-line">
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;
        return (
          <div key={item.q.es}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left font-heading text-base font-semibold text-ink transition hover:text-brand-text"
              >
                {tr(item.q, lang)}
                <span
                  aria-hidden="true"
                  className={`shrink-0 text-xl text-brand-text transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="pb-5 text-sm leading-relaxed text-ink-2"
            >
              {tr(item.a, lang)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Bloque de cifras destacadas. */
export function StatRow({ stats, lang }) {
  return (
    <dl className="grid gap-8 text-center sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.value}>
          {/* El <dt> lleva la etiqueta y el <dd> solo el valor: si el texto
              visible repitiera la del <dt>, el lector de pantalla la leía dos
              veces ("Proyectos entregados, 40+, Proyectos entregados"). */}
          <dt className="font-heading text-4xl font-bold text-brand-text">{stat.value}</dt>
          <dd className="mt-2 text-sm text-ink-2">{tr(stat.label, lang)}</dd>
        </div>
      ))}
    </dl>
  );
}
