import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import NotFound from './pages/NotFound';
import { ROUTES } from './routes';
import useDocumentMeta from './lib/useDocumentMeta';
import { StructuredData } from './components/StructuredData';

/** Sube al inicio en cada navegación. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function App() {
  useDocumentMeta();

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-brand-ink"
      >
        Saltar al contenido
      </a>

      <Navbar />
      <ScrollToTop />
      <StructuredData />

      {/* tabIndex={-1} para que el ancla mueva el foco, no solo el scroll.
          Sin esto, el siguiente Tab volvía al navbar. */}
      <main id="main" tabIndex={-1} className="flex-1 pt-16 focus:outline-none">
        <Routes>
          {ROUTES.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
