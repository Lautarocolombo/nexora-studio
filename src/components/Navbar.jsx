import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { NAV_ROUTES } from '../routes';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { lang, setLang, isEn } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-line bg-glass backdrop-blur-xl' : ''
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between gap-4" aria-label="Principal">
        <Link to="/" className="flex items-center gap-2 font-heading font-bold">
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center rounded-sm bg-gradient-to-br from-brand to-accent-jade text-sm font-bold text-brand-ink"
          >
            N
          </span>
          <span>
            NEXORA <span className="gradient-text">STUDIO</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ROUTES.map(({ path: to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `rounded-sm px-3 py-2 text-sm font-medium transition ${
                    isActive ? 'text-brand-text' : 'text-ink-2 hover:text-ink'
                  }`
                }
              >
                {isEn ? label.en : label.es}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLang(isEn ? 'es' : 'en')}
            aria-label={isEn ? 'Cambiar a español' : 'Switch to English'}
            className="rounded-md border border-line px-3 py-2 font-heading text-xs font-semibold text-ink-2 transition hover:border-line-accent hover:text-ink"
          >
            {isEn ? 'ES' : 'EN'}
          </button>
          <ThemeToggle
            t={
              isEn
                ? { toLight: 'Switch to light mode', toDark: 'Switch to dark mode' }
                : { toLight: 'Activar modo claro', toDark: 'Activar modo oscuro' }
            }
          />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Cerrar menú móvil' : 'Abrir menú móvil'}
            className="grid h-10 w-10 place-items-center rounded-md border border-line md:hidden"
          >
            <span aria-hidden="true">{open ? '✕' : '☰'}</span>
          </button>
        </div>
      </nav>

      {open ? (
        <div id="mobile-nav" className="border-t border-line bg-glass backdrop-blur-xl md:hidden">
          <ul className="container-x flex flex-col py-3">
            {NAV_ROUTES.map(({ path: to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `block rounded-sm px-3 py-3 text-sm font-medium transition ${
                      isActive ? 'text-brand-text' : 'text-ink-2'
                    }`
                  }
                >
                  {isEn ? label.en : label.es}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
