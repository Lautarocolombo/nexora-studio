import { useCallback, useEffect, useRef, useState } from 'react';
import Thumbnails from './Thumbnails';
import Lightbox from './Lightbox';

/** Umbral mínimo en px para considerar que el gesto fue un swipe. */
const SWIPE_THRESHOLD = 45;

/**
 * Visor/carrusel de imágenes de un proyecto, embebido en la página.
 * No ofrece descargas: todo se ve inline o en el lightbox.
 */
export default function ProjectViewer({ project, lang, t }) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const pointerStart = useRef(null);

  const images = project.images;
  const total = images.length;

  // No hace falta reiniciar el índice con un efecto: ProjectShowcase monta
  // este componente con key={active.slug}, así que al cambiar de proyecto se
  // remonta y el estado arranca en 0.

  const go = useCallback(
    (delta) => setIndex((current) => (current + delta + total) % total),
    [total],
  );
  const goTo = useCallback((next) => setIndex(Math.min(Math.max(next, 0), total - 1)), [total]);

  // Precarga SOLO la imagen siguiente: mantiene el scroll liviano.
  useEffect(() => {
    const next = images[(index + 1) % total];
    if (!next) return;
    const preloader = new Image();
    preloader.src = next.src;
  }, [index, images, total]);

  // ← / → funcionan con el foco dentro del visor (no secuestran el scroll de la página).
  const onKeyDown = (event) => {
    if (lightboxOpen) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(-1);
    }
  };

  // Swipe en celular.
  const onPointerDown = (event) => {
    if (event.pointerType === 'mouse') return;
    pointerStart.current = event.clientX;
  };
  const onPointerUp = (event) => {
    if (pointerStart.current === null) return;
    const delta = event.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    go(delta < 0 ? 1 : -1);
  };

  if (!total) return null;

  const current = images[index];
  const counter = `${index + 1} / ${total}`;

  return (
    <div
      onKeyDown={onKeyDown}
      role="group"
      aria-roledescription={t?.carousel ?? 'carrusel'}
      aria-label={`${project.name?.[lang] ?? project.slug} — ${t?.screenshots ?? 'capturas'}`}
      className="w-full"
    >
      {/* ─── Escenario principal 16:9 ─── */}
      <div className="relative">
        <div
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          className="relative aspect-video w-full overflow-hidden rounded-lg border border-line bg-elevated shadow-soft"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label={`${t?.expand ?? 'Ampliar'} ${current.alt}`}
            className="group/stage block h-full w-full cursor-zoom-in"
          >
            <img
              key={current.src}
              src={current.src}
              alt={current.alt}
              width="1600"
              height="900"
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              decoding="async"
              className="anim-fade-slide h-full w-full object-cover transition-transform duration-500 group-hover/stage:scale-[1.02]"
            />
          </button>

          {/* Flechas */}
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={t?.prev ?? 'Imagen anterior'}
            className="absolute top-1/2 left-2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/55 text-2xl leading-none text-white backdrop-blur-sm transition hover:bg-black/75 sm:left-4 sm:h-12 sm:w-12"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={t?.next ?? 'Imagen siguiente'}
            className="absolute top-1/2 right-2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/55 text-2xl leading-none text-white backdrop-blur-sm transition hover:bg-black/75 sm:right-4 sm:h-12 sm:w-12"
          >
            <span aria-hidden="true">›</span>
          </button>

          {/* Contador */}
          <div className="absolute right-3 bottom-3 rounded-full bg-black/65 px-3 py-1 font-heading text-xs font-semibold tabular-nums text-white backdrop-blur-sm sm:right-4 sm:bottom-4">
            {counter}
          </div>
        </div>

        {/* ─── Puntos de navegación ─── */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {images.map((image, dotIndex) => {
            const isActive = dotIndex === index;
            return (
              <button
                key={image.src}
                type="button"
                onClick={() => goTo(dotIndex)}
                aria-label={`${t?.goTo ?? 'Ir a la imagen'} ${dotIndex + 1}`}
                aria-current={isActive ? 'true' : undefined}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive ? 'w-7 bg-brand' : 'w-2 bg-ink-muted/50 hover:bg-brand/60'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* ─── Miniaturas ─── */}
      <div className="mt-5">
        <Thumbnails
          images={images}
          activeIndex={index}
          onSelect={goTo}
          t={t}
          label={`${t?.thumbnailsLabel ?? 'Miniaturas'} — ${project.name?.[lang] ?? project.slug}`}
        />
      </div>

      <Lightbox
        open={lightboxOpen}
        images={images}
        index={index}
        onClose={() => setLightboxOpen(false)}
        onNext={setIndex}
        t={t}
        caption={`${project.name?.[lang] ?? ''} — ${counter}`}
      />
    </div>
  );
}
