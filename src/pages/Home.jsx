import { Link } from 'react-router-dom';
import { SectionIntro, CTABand, ProcessSteps, StatRow } from '../components/ui';
import ProjectShowcase from '../components/portfolio/ProjectShowcase';
import { useLang } from '../i18n/LanguageContext';
import { PROJECTS } from '../data/portfolio';
import { HOME_SERVICES, STATS, TESTIMONIALS, t as tr } from '../data/site';

const COPY = {
  es: {
    badge: 'Estudio digital · Gualeguay, Argentina',
    titleA: 'Transformamos ideas en',
    titleB: 'soluciones digitales',
    subtitle:
      'Somos Nexora Studio: diseño y desarrollo web a medida para PyMEs y emprendedores del interior. Sin plantillas, con código propio y acompañamiento real.',
    ctaQuote: 'Pedir presupuesto',
    ctaPortfolio: 'Ver portfolio',
    whoLabel: 'Quiénes somos',
    whoTitle: 'Un estudio que combina diseño, técnica y estrategia.',
    whoText:
      'Creamos presencias digitales con identidad propia y resultados medibles. Trabajamos de cerca con cada cliente para entender su negocio y construir productos que escalan con él.',
    servicesLabel: 'Qué hacemos',
    servicesTitle: 'Servicios para cada etapa de tu proyecto.',
    viewService: 'Ver servicio',
    casesLabel: 'Casos de estudio',
    casesTitle: 'Trabajos reales con impacto medible.',
    casesText:
      'Cada proyecto combina estética, usabilidad y estrategia para generar resultados concretos.',
    seeAll: 'Ver todo el portfolio',
    processLabel: 'Cómo trabajamos',
    processTitle: 'Cinco pasos, sin sorpresas.',
    clientsLabel: 'Clientes',
    clientsTitle: 'Lo que dicen quienes confiaron en nosotros',
    bandLead: 'Transformá tu presencia digital',
    bandTitle: 'Hablemos del proyecto que tu marca merece.',
    bandCta: 'Pedir presupuesto',
  },
  en: {
    badge: 'Digital studio · Gualeguay, Argentina',
    titleA: 'We turn ideas into',
    titleB: 'digital solutions',
    subtitle:
      'We are Nexora Studio: custom web design and development for SMEs and entrepreneurs in the heartland. No templates, owned code, and real accompaniment.',
    ctaQuote: 'Get a quote',
    ctaPortfolio: 'View portfolio',
    whoLabel: 'Who we are',
    whoTitle: 'A studio that combines design, engineering and strategy.',
    whoText:
      'We build digital presences with their own identity and measurable results. We work closely with every client to understand their business and build products that scale with it.',
    servicesLabel: 'What we do',
    servicesTitle: 'Services for every stage of your project.',
    viewService: 'View service',
    casesLabel: 'Case studies',
    casesTitle: 'Real work with measurable impact.',
    casesText:
      'Every project combines aesthetics, usability and strategy to generate concrete results.',
    seeAll: 'See the full portfolio',
    processLabel: 'How we work',
    processTitle: 'Five steps, no surprises.',
    clientsLabel: 'Clients',
    clientsTitle: 'What people who trusted us say',
    bandLead: 'Transform your digital presence',
    bandTitle: "Let's talk about the project your brand deserves.",
    bandCta: 'Get a quote',
  },
};

export default function Home() {
  const { lang } = useLang();
  const c = COPY[lang] ?? COPY.es;

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="container-x text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-line-accent bg-card px-4 py-1.5 font-heading text-xs font-semibold tracking-[0.18em] text-brand-text uppercase">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand" />
            {c.badge}
          </span>

          <h1 className="mx-auto mt-6 max-w-4xl font-heading text-4xl leading-[1.08] font-bold sm:text-5xl lg:text-6xl">
            {c.titleA} <span className="gradient-text">{c.titleB}</span>.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-2">{c.subtitle}</p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/contacto" className="btn btn-primary">
              {c.ctaQuote}
            </Link>
            <Link to="/portfolio" className="btn btn-outline">
              {c.ctaPortfolio}
            </Link>
          </div>

          <div className="mt-14 border-t border-line pt-10">
            <StatRow stats={STATS} lang={lang} />
          </div>
        </div>
      </section>

      {/* ─── Quiénes somos ─── */}
      <section className="pb-8">
        <div className="container-x">
          <SectionIntro label={c.whoLabel} title={c.whoTitle} description={c.whoText} />
        </div>
      </section>

      {/* ─── Servicios ─── */}
      <section className="py-16">
        <div className="container-x">
          <SectionIntro label={c.servicesLabel} title={c.servicesTitle} className="mb-12" />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOME_SERVICES.map((service) => (
              <li
                key={service.name.es}
                className={`surface-card flex flex-col p-7 transition hover:bg-card-hover ${
                  service.featured ? 'border-line-accent' : ''
                }`}
              >
                <span aria-hidden="true" className="text-3xl">
                  {service.icon}
                </span>
                <h2 className="mt-4 font-heading text-lg font-semibold">{tr(service.name, lang)}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-2">
                  {tr(service.desc, lang)}
                </p>
                <Link
                  to="/servicios"
                  className={`btn mt-6 ${service.featured ? 'btn-primary' : 'btn-outline'}`}
                >
                  {c.viewService}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── NUESTROS TRABAJOS ─── */}
      <ProjectShowcase projects={PROJECTS} lang={lang} />

      {/* ─── Proceso ─── */}
      <section className="pb-8">
        <div className="container-x">
          <SectionIntro label={c.processLabel} title={c.processTitle} />
        </div>
      </section>
      <ProcessSteps lang={lang} />

      {/* ─── Testimonios ─── */}
      <section className="border-t border-line py-20">
        <div className="container-x">
          <SectionIntro label={c.clientsLabel} title={c.clientsTitle} className="mb-12" />
          <ul className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((item) => (
              <li key={item.name} className="surface-card flex flex-col p-7">
                {/* role="img": en un <p> el aria-label se descarta (role=generic).
                    El texto va oculto para no duplicar las 5 estrellas. */}
                <p role="img" aria-label={lang === 'es' ? '5 de 5 estrellas' : '5 out of 5 stars'}>
                  <span aria-hidden="true">⭐⭐⭐⭐⭐</span>
                </p>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-2">
                  {tr(item.quote, lang)}
                </blockquote>
                <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand to-accent-jade font-heading font-semibold text-brand-ink"
                  >
                    {item.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{item.name}</p>
                    <p className="text-xs text-ink-muted">{tr(item.role, lang)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTABand lead={c.bandLead} title={c.bandTitle} ctaLabel={c.bandCta} />
    </>
  );
}
