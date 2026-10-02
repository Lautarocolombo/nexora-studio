import { PageHero } from '../components/ui';
import { UPDATED_NOTE, t as tr } from '../data/site';

/**
 * Renderizador único para los documentos legales.
 *
 * El contenido viene de `src/data/site.js` y está escrito a mano por el
 * estudio, no proviene de usuarios, por eso se usa dangerouslySetInnerHTML
 * para conservar los <strong> y los enlaces a mailto sin markup duplicado.
 */
export default function Legal({ eyebrow, title, subtitle, sections, lang = 'es' }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} subtitle={subtitle} />

      <section className="pb-24">
        <div className="container-x">
          <article className="mx-auto max-w-3xl">
            <p className="rounded-sm border border-line-accent bg-card px-4 py-3 text-sm text-ink-2">
              {tr(UPDATED_NOTE, lang)}
            </p>

            <div className="mt-10 space-y-9">
              {sections.map((section) => (
                <section key={section.title.es}>
                  <h2 className="font-heading text-xl font-semibold text-ink">
                    {tr(section.title, lang)}
                  </h2>
                  <div className="mt-3 space-y-3">
                    {tr(section.body, lang).map((block, index) =>
                      block.t === 'ul' ? (
                        <ul key={index} className="space-y-2 text-ink-2">
                          {block.items.map((item) => (
                            <li key={item} className="flex gap-2">
                              <span aria-hidden="true" className="text-brand-text">
                                •
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p
                          key={index}
                          className="leading-relaxed text-ink-2"
                          dangerouslySetInnerHTML={{ __html: block.html }}
                        />
                      ),
                    )}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
