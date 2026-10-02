import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';

const COPY = {
  es: {
    badge: 'Error 404',
    titleA: 'Página no',
    titleB: 'encontrada',
    text: 'La página que buscás no existe o fue movida. Te invitamos a volver al inicio o a explorar nuestros servicios.',
    ctaHome: 'Volver al inicio',
    ctaPortfolio: 'Ver portfolio',
  },
  en: {
    badge: 'Error 404',
    titleA: 'Page not',
    titleB: 'found',
    text: 'The page you are looking for does not exist or has been moved. Head back home or browse our work.',
    ctaHome: 'Back to home',
    ctaPortfolio: 'View portfolio',
  },
};

export default function NotFound() {
  const { isEn } = useLang();
  const c = isEn ? COPY.en : COPY.es;

  return (
    <section className="relative overflow-hidden pt-36 pb-28">
      <div className="container-x text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-line-accent bg-card px-4 py-1.5 font-heading text-xs font-semibold tracking-[0.18em] text-brand-text uppercase">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand" />
          {c.badge}
        </span>

        <h1 className="mt-6 font-heading text-4xl leading-[1.1] font-bold sm:text-5xl lg:text-6xl">
          {c.titleA} <span className="gradient-text">{c.titleB}</span>.
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg text-ink-2">{c.text}</p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/" className="btn btn-primary">
            {c.ctaHome}
          </Link>
          <Link to="/portfolio" className="btn btn-outline">
            {c.ctaPortfolio}
          </Link>
        </div>
      </div>
    </section>
  );
}
