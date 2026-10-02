import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';

export default function Footer() {
  const { isEn } = useLang();

  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-x grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-heading font-bold">
            <span
              aria-hidden="true"
              className="grid h-8 w-8 place-items-center rounded-sm bg-gradient-to-br from-brand to-accent-jade text-sm font-bold text-brand-ink"
            >
              N
            </span>
            <span>
              NEXORA <span className="gradient-text">STUDIO</span>
            </span>
          </div>
          <p className="mt-4 text-sm text-ink-2">
            {isEn
              ? 'We turn ideas into digital solutions for SMEs and entrepreneurs from Argentina’s interior.'
              : 'Transformamos ideas en soluciones digitales para PyMEs y emprendedores del interior de Argentina.'}
          </p>
        </div>

        <nav aria-label={isEn ? 'Services' : 'Servicios'}>
          <h2 className="font-heading text-sm font-semibold text-ink">
            {isEn ? 'Services' : 'Servicios'}
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-ink-2">
            <li>
              <Link to="/portfolio" className="transition hover:text-brand-text">
                {isEn ? 'Landing pages' : 'Landing Pages'}
              </Link>
            </li>
            <li>
              <Link to="/portfolio" className="transition hover:text-brand-text">
                eCommerce
              </Link>
            </li>
            <li>
              <Link to="/servicios" className="transition hover:text-brand-text">
                {isEn ? 'Systems' : 'Sistemas'}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label={isEn ? 'Contact' : 'Contacto'}>
          <h2 className="font-heading text-sm font-semibold text-ink">
            {isEn ? 'Contact' : 'Contacto'}
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-ink-2">
            <li>
              <a
                href="https://wa.me/5493444517496"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-brand-text"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <Link to="/contacto" className="transition hover:text-brand-text">
                {isEn ? 'Request a quote' : 'Cotizar proyecto'}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="container-x flex flex-col gap-2 border-t border-line py-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Nexora Studio. {isEn ? 'All rights reserved.' : 'Todos los derechos reservados.'}</p>
        <p className="flex gap-4">
          <Link to="/privacidad" className="transition hover:text-brand-text">
            {isEn ? 'Privacy' : 'Privacidad'}
          </Link>
          <Link to="/terminos" className="transition hover:text-brand-text">
            {isEn ? 'Terms' : 'Términos'}
          </Link>
        </p>
      </div>
    </footer>
  );
}
