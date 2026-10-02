import { Link } from 'react-router-dom';
import { PageHero, SectionIntro, CTABand, ProcessSteps } from '../components/ui';
import { useLang } from '../i18n/LanguageContext';
import { SERVICES, t as tr } from '../data/site';

const COPY = {
  es: {
    eyebrow: 'Servicios',
    title: 'Servicios web a medida para PyMEs y emprendedores del interior.',
    subtitle:
      'Desarrollamos sitios web, sistemas de gestión, tiendas online y aplicaciones. Sin plantillas, con código propio y acompañamiento real.',
    ctaQuote: 'Pedir presupuesto',
    ctaServices: 'Ver servicios',
    label: 'Oferta de servicios',
    heading: 'Una propuesta digital completa para tu negocio.',
    description:
      'Cada servicio se entrega con un enfoque creativo, técnico y estratégico para crear una presencia digital única y coherente con tu marca.',
    processLabel: 'Cómo trabajamos',
    processTitle: 'Un proceso claro y sencillo para lanzar tu proyecto con tranquilidad.',
    includes: 'Incluye',
    bandLead: 'Transformá tu presencia digital',
    bandTitle: 'Hablemos del proyecto que tu marca merece.',
    bandCta: 'Pedir presupuesto',
  },
  en: {
    eyebrow: 'Services',
    title: 'Custom web services for SMEs and entrepreneurs in the heartland.',
    subtitle:
      'We develop websites, management systems, online stores and applications. No templates, owned code and real accompaniment.',
    ctaQuote: 'Get a quote',
    ctaServices: 'View services',
    label: 'Service offering',
    heading: 'A complete digital proposal for your business.',
    description:
      'Every service is delivered with a creative, technical and strategic approach to build a unique digital presence aligned with your brand.',
    processLabel: 'How we work',
    processTitle: 'A clear, simple process to launch your project with peace of mind.',
    includes: 'Includes',
    bandLead: 'Transform your digital presence',
    bandTitle: "Let's talk about the project your brand deserves.",
    bandCta: 'Get a quote',
  },
};

export default function Services() {
  const { lang } = useLang();
  const c = COPY[lang] ?? COPY.es;

  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle}>
        <Link to="/contacto" className="btn btn-primary">
          {c.ctaQuote}
        </Link>
        <a href="#servicios" className="btn btn-outline">
          {c.ctaServices}
        </a>
      </PageHero>

      <section className="pb-8">
        <div className="container-x">
          <SectionIntro label={c.label} title={c.heading} description={c.description} />
        </div>
      </section>

      {/* ─── Tarjetas de servicio ─── */}
      <section id="servicios" className="py-12">
        <div className="container-x">
          <ul className="grid gap-6 md:grid-cols-2">
            {SERVICES.map((service) => (
              <li
                key={service.id}
                className={`surface-card flex flex-col p-7 transition hover:bg-card-hover ${
                  service.featured ? 'border-line-accent shadow-glow' : ''
                }`}
              >
                <span aria-hidden="true" className="text-3xl">
                  {service.icon}
                </span>
                <h2 className="mt-4 font-heading text-xl font-semibold">{tr(service.name, lang)}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{tr(service.desc, lang)}</p>

                <p className="mt-5 font-heading text-xs font-semibold tracking-[0.14em] text-brand-text uppercase">
                  {c.includes}
                </p>
                <ul className="mt-3 space-y-2 text-sm text-ink-2">
                  {tr(service.includes, lang).map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span aria-hidden="true" className="text-brand-text">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-end justify-between gap-4 border-t border-line pt-5">
                  <div>
                    <span className="text-xs text-ink-muted">{tr(service.priceFrom, lang)}</span>
                    <p className="font-heading text-2xl font-bold text-ink">
                      {/* USD siempre con separador de miles anglosajón ($2,000), como en el sitio original. */}
                      ${service.price.toLocaleString('en-US')}{' '}
                      <span className="text-sm font-medium text-ink-muted">USD</span>
                    </p>
                  </div>
                  <p className="text-sm text-ink-2">{tr(service.time, lang)}</p>
                </div>

                <Link
                  to="/contacto"
                  className={`btn mt-6 ${service.featured ? 'btn-primary' : 'btn-outline'}`}
                >
                  {tr(service.cta, lang)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── Proceso ─── */}
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
