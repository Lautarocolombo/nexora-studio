import { useEffect, useRef } from 'react';

/**
 * Tira de miniaturas con scroll horizontal.
 * La miniatura activa se mantiene centrada al cambiar.
 *
 * Importante: se desplaza la tira con `scrollTo`, NO con `scrollIntoView`.
 * `scrollIntoView` también mueve la página verticalmente, lo que al montar
 * hacía que la home cayera sola 1900px hasta la sección de trabajos y
 * arrastraba el punto de inicio de la tabulación por el teclado.
 */
export default function Thumbnails({ images, activeIndex, onSelect, label, t }) {
  const trackRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const track = trackRef.current;
    const item = itemRefs.current[activeIndex];
    if (!track || !item) return;
    // offsetLeft es relativo al track (posicionado con `relative`).
    const target = item.offsetLeft - (track.clientWidth - item.offsetWidth) / 2;
    track.scrollTo({ left: Math.max(target, 0), behavior: 'smooth' });
  }, [activeIndex]);

  // El teclado sobre la tira también recorre el carrusel.
  // Se detiene la propagación: ProjectViewer tiene un handler de ←/→ en la
  // raíz y la tira es su descendiente. Sin esto, un ArrowRight disparaba
  // ambos handlers y avanzaba DOS imágenes (y rompía el wrap del final).
  const onKeyDown = (event) => {
    const last = images.length - 1;
    let next = null;
    if (event.key === 'ArrowRight') next = activeIndex >= last ? 0 : activeIndex + 1;
    else if (event.key === 'ArrowLeft') next = activeIndex <= 0 ? last : activeIndex - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;
    if (next === null) return;
    event.preventDefault();
    event.stopPropagation();
    onSelect(next);
  };

  return (
    <div
      className="relative"
      role="group"
      aria-label={label ?? t?.thumbnailsLabel ?? 'Miniaturas'}
    >
      <div
        ref={trackRef}
        onKeyDown={onKeyDown}
        className="relative flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:thin]"
        style={{ scrollbarColor: 'var(--color-brand) transparent' }}
      >
        {images.map((image, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={image.src}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`${t?.showImage ?? 'Ver imagen'} ${index + 1}${image.alt ? ` — ${image.alt}` : ''}`}
              aria-current={isActive ? 'true' : undefined}
              className={`relative shrink-0 snap-start overflow-hidden rounded-sm border-2 transition-all duration-300 ${
                isActive
                  ? 'border-brand opacity-100 shadow-glow'
                  : 'border-transparent opacity-55 hover:opacity-90'
              }`}
            >
              <img
                src={image.src}
                alt=""
                aria-hidden="true"
                width="1600"
                height="900"
                loading="lazy"
                decoding="async"
                className="h-16 w-28 object-cover sm:h-20 sm:w-40"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
