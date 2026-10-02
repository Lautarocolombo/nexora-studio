import { Link } from 'react-router-dom';
import { PageHero, SectionIntro, CTABand, ProcessSteps, StatRow } from '../components/ui';
import { useLang } from '../i18n/LanguageContext';
import { STATS, VALUES, t as tr } from '../data/site';

const COPY = {
  es: {
    eyebrow: 'Sobre nosotros',
    title: 'Un estudio digital del interior, pensado para PyMEs.',
    subtitle:
      'Somos Nexora Studio: diseñamos y desarrollamos sitios, tiendas y sistemas con código propio, acompañando a cada cliente desde la idea hasta el lanzamiento.',
    ctaWork: 'Trabajemos juntos',
    ctaPortfolio: 'Ver portfolio',
    label: 'Nuestra misión',
    heading: 'Hacer que tu marca tenga una presencia digital a la altura de tu propuesta.',
    description:
      'Creemos que el interior del país merece tecnología de calidad. Por eso trabajamos sin plantillas, con procesos claros y precios transparentes en dólares, para que PyMEs y emprendedores compitan con una web profesional y escalable.',
    statsLabel: 'En números',
    statsTitle: 'Resultados que hablan por sí solos.',
    processLabel: 'Cómo trabajamos',
    processTitle: 'Un proceso claro y sencillo para lanzar tu proyecto con tranquilidad.',
    bandLead: '¿Sumamos tu proyecto?',
    bandTitle: 'Hablemos de la web que tu marca merece.',
    bandCta: 'Pedir presupuesto',
  },
  en: {
    eyebrow: 'About us',
    title: 'A digital studio from the heartland, built for SMEs.',
    subtitle:
      'We are Nexora Studio: we design and develop sites, stores and systems with owned code, accompanying each client from idea to launch.',
    ctaWork: "Let's work together",
    ctaPortfolio: 'View portfolio',
    label: 'Our mission',
    heading: 'Make your brand have a digital presence worthy of your proposition.',
    description:
      'We believe the heartland deserves quality technology. That is why we work without templates, with clear processes and transparent prices in dollars, so SMEs and entrepreneurs can compete with a professional, scalable website.',
    statsLabel: 'In numbers',
    statsTitle: 'Results that speak for themselves.',
    processLabel: 'How we work',
    processTitle: 'A clear, simple process to launch your project with peace of mind.',
    bandLead: 'Shall we add your project?',
    bandTitle: "Let's talk about the website your brand deserves.",
    bandCta: 'Get a quote',
  },
};

export default function About() {
  const { lang } = useLang();
  const c = COPY[lang] ?? COPY.es;

  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle}>
        <Link to="/contacto" className="btn btn-primary">
          {c.ctaWork}
        </Link>
        <Link to="/portfolio" className="btn btn-outline">
          {c.ctaPortfolio}
        </Link>
      </PageHero>

      <section className="pb-8">
        <div className="container-x">
          <SectionIntro label={c.label} title={c.heading} description={c.description} />
        </div>
      </section>

      {/* ─── Diferenciales ─── */}
      <section className="py-12">
        <div className="container-x">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => (
              <li key={value.name.es} className="surface-card p-7 transition hover:bg-card-hover">
                <span aria-hidden="true" className="text-3xl">
                  {value.icon}
                </span>
                <h2 className="mt-4 font-heading text-lg font-semibold">{tr(value.name, lang)}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{tr(value.desc, lang)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── Cifras ─── */}
      <section className="py-16">
        <div className="container-x">
          <SectionIntro label={c.statsLabel} title={c.statsTitle} className="mb-14" />
          <StatRow stats={STATS} lang={lang} />
        </div>
      </section>

      <section className="pb-20">
        <div className="container-x">
          <SectionIntro label={c.processLabel} title={c.processTitle} />
        </div>
      </section>
      <ProcessSteps lang={lang} />

      <CTABand lead={c.bandLead} title={c.bandTitle} ctaLabel={c.bandCta} />
    </>
  );
}
