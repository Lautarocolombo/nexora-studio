import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * Lightbox a pantalla completa.
 * Se monta en un portal sobre <body>, bloquea el scroll, toma el foco al
 * abrir y lo devuelve al elemento que lo disparó al cerrar.
 */
export default function Lightbox({ open, images, index, caption, onClose, onNext, t }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const restoreRef = useRef(null);

  // onNext llega inline desde ProjectViewer; con ref evitamos re-suscribir
  // el efecto de teclado en cada render.
  const onNextRef = useRef(onNext);
  onNextRef.current = onNext;

  const go = useCallback(
    (delta) => {
      onNextRef.current((index + delta + images.length) % images.length);
    },
    [index, images.length],
  );

  useEffect(() => {
    if (!open) return undefined;

    restoreRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        go(-1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        go(1);
      } else if (event.key === 'Tab') {
        // Mantiene el foco dentro del lightbox mientras esté abierto.
        const focusables = panelRef.current?.querySelectorAll('button');
        if (!focusables?.length) return;
        const list = Array.from(focusables);
        const first = list[0];
        const last = list[list.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      restoreRef.current?.focus?.();
    };
    // Se monta al abrir y se desmonta al cerrar. `go` cambia con `index` a
    // propósito: si fuera dependencia, navegar con ←/→ re-ejecutaría el
    // cleanup y devolvería el foco al fondo del modal en cada pulsación,
    // anunciando el contenido de fondo al lector de pantalla.
  }, [open]);

  // Precarga las vecinas para que el cambio sea instantáneo.
  useEffect(() => {
    if (!open) return;
    [images[(index + 1) % images.length], images[(index - 1 + images.length) % images.length]]
      .filter(Boolean)
      .forEach((neighbor) => {
        const preloader = new Image();
        preloader.src = neighbor.src;
      });
  }, [open, index, images]);

  if (!open) return null;

  const image = images[index];

  return createPortal(
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={t?.lightboxLabel ?? 'Visor de imagen'}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-black/92 p-4 backdrop-blur-sm sm:p-8"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label={t?.close ?? 'Cerrar visor'}
        className="absolute top-4 right-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-xl text-white transition hover:bg-white/20 sm:top-6 sm:right-6"
      >
        <span aria-hidden="true">✕</span>
      </button>

      <button
        type="button"
        onClick={() => go(-1)}
        aria-label={t?.prev ?? 'Imagen anterior'}
        className="absolute left-2 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-2xl text-white transition hover:bg-white/20 sm:left-6 sm:h-13 sm:w-13"
      >
        <span aria-hidden="true">‹</span>
      </button>

      <button
        type="button"
        onClick={() => go(1)}
        aria-label={t?.next ?? 'Imagen siguiente'}
        className="absolute right-2 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-2xl text-white transition hover:bg-white/20 sm:right-6 sm:h-13 sm:w-13"
      >
        <span aria-hidden="true">›</span>
      </button>

      <figure className="flex max-h-full w-full max-w-6xl flex-col items-center gap-3">
        {/* aspect-ratio fijo = sin saltos de layout */}
        <div className="flex max-h-[72vh] w-full items-center justify-center overflow-hidden rounded-lg">
          <img
            key={image.src}
            src={image.src}
            alt={image.alt}
            width="1600"
            height="900"
            loading="eager"
            decoding="async"
            className="anim-fade-slide max-h-[72vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
          />
        </div>
        {caption ? (
          <figcaption className="text-center text-sm text-white/70">{caption}</figcaption>
        ) : null}
      </figure>
    </div>,
    document.body,
  );
}
