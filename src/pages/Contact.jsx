import { useState } from 'react';
import { PageHero, SectionIntro, FAQList } from '../components/ui';
import { useLang } from '../i18n/LanguageContext';
import { CONTACT, CONTACT_ITEMS, FAQ, SERVICE_OPTIONS, t as tr } from '../data/site';

const COPY = {
  es: {
    eyebrow: 'Contacto',
    title: '¿Listo para escalar tu presencia digital?',
    subtitle:
      'Contanos tu proyecto y creamos una solución a medida. Cotización sin compromiso, respuesta en menos de 24 horas.',
    ctaWhatsapp: '💬 Escribir por WhatsApp',
    ctaEmail: 'Enviar email',
    directTitle: 'Contacto directo',
    directText: 'Elegí el canal que prefieras y contanos tu idea. Respondemos en menos de 24 horas hábiles.',
    cardTitle: 'Propuesta en menos de 24hs',
    cardText: 'Mandanos tu consulta y te devolvemos un plan con alcance, tiempos y costos.',
    formTitle: 'Chateemos por WhatsApp',
    formSubtitle:
      'Es la forma más rápida de arrancar. Completá el formulario y te derivamos directo a WhatsApp con tu consulta lista.',
    name: 'Nombre',
    namePlaceholder: 'Tu nombre',
    email: 'Email',
    emailPlaceholder: 'tunombre@empresa.com',
    service: 'Servicio',
    message: 'Mensaje',
    messagePlaceholder: 'Contanos tu idea, objetivos y plazos...',
    company: 'Empresa',
    submit: '💬 Abrir WhatsApp',
    note: 'Al enviar se abrirá WhatsApp con tu mensaje preescrito. No compartimos tus datos con terceros.',
    alt: 'O escribinos directo a',
    error: 'Por favor completá tu nombre y mensaje.',
    faqLabel: 'FAQ',
    faqTitle: 'Preguntas frecuentes',
    faqText: 'Acá respondemos los puntos que más consultan nuestros clientes antes de comenzar un proyecto.',
  },
  en: {
    eyebrow: 'Contact',
    title: 'Ready to scale your digital presence?',
    subtitle:
      'Tell us about your project and we will build a custom solution. No-obligation quote, reply in under 24 hours.',
    ctaWhatsapp: '💬 Message us on WhatsApp',
    ctaEmail: 'Send an email',
    directTitle: 'Direct contact',
    directText: 'Pick the channel you prefer and tell us your idea. We reply in under 24 business hours.',
    cardTitle: 'Proposal within 24h',
    cardText: 'Send us your enquiry and we will get back with a plan covering scope, timelines and costs.',
    formTitle: "Let's chat on WhatsApp",
    formSubtitle:
      'It is the fastest way to get started. Fill in the form and we will take you straight to WhatsApp with your message ready.',
    name: 'Name',
    namePlaceholder: 'Your name',
    email: 'Email',
    emailPlaceholder: 'you@company.com',
    service: 'Service',
    message: 'Message',
    messagePlaceholder: 'Tell us your idea, goals and deadlines...',
    company: 'Company',
    submit: '💬 Open WhatsApp',
    note: 'On submit, WhatsApp opens with your message pre-filled. We never share your data with third parties.',
    alt: 'Or write us directly at',
    error: 'Please fill in your name and message.',
    faqLabel: 'FAQ',
    faqTitle: 'Frequently asked questions',
    faqText: 'We answer the questions clients ask us most before starting a project.',
  },
};

export default function Contact() {
  const { lang } = useLang();
  const c = COPY[lang] ?? COPY.es;

  const [values, setValues] = useState({ name: '', email: '', service: '', message: '' });
  const [honeypot, setHoneypot] = useState('');
  const [error, setError] = useState('');

  const whatsappHref = `https://wa.me/${CONTACT.whatsappNumber}?text=${CONTACT.whatsappPrefill}`;
  const update = (key) => (event) => setValues((v) => ({ ...v, [key]: event.target.value }));

  const onSubmit = (event) => {
    event.preventDefault();

    // Trampa anti-spam: si el bot llenó el campo oculto, cortamos.
    if (honeypot.trim()) return;

    const name = values.name.trim();
    const email = values.email.trim();
    const service = values.service;
    const message = values.message.trim();

    if (!name || !message) {
      setError(c.error);
      return;
    }
    setError('');

    // El email se pedía pero se descartaba: era el único dato de recoupero
    // que el formulario captura. El servicio es opcional, así que si viene
    // vacío no se escribe "quiero consultar por: ."
    const parts = [`Hola Nexora Studio, soy ${name}.`];
    if (service) parts.push(`Quiero consultar por: ${service}.`);
    if (email) parts.push(`Mi email es: ${email}.`);
    parts.push(message);

    const text = encodeURIComponent(parts.join(' '));
    window.open(`https://wa.me/${CONTACT.whatsappNumber}?text=${text}`, '_blank', 'noopener');
  };

  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle}>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          {c.ctaWhatsapp}
        </a>
        <a href={`mailto:${CONTACT.email}`} className="btn btn-outline">
          {c.ctaEmail}
        </a>
      </PageHero>

      <section id="contacto" className="pb-20">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          {/* ─── Datos de contacto ─── */}
          <div>
            <h2 className="section-title">{c.directTitle}</h2>
            <p className="section-desc mt-3">{c.directText}</p>

            <ul className="mt-8 space-y-4">
              {CONTACT_ITEMS.map((item) => (
                <li key={item.title.es} className="surface-card flex items-start gap-4 p-5">
                  <span aria-hidden="true" className="text-2xl">
                    {item.icon}
                  </span>
                  <div>
                    <h3 className="font-heading text-sm font-semibold text-ink">
                      {tr(item.title, lang)}
                    </h3>
                    <p className="mt-0.5 text-sm text-ink-2">{tr(item.text, lang)}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-md border border-line-accent bg-card p-6">
              <span aria-hidden="true" className="text-2xl">
                ⚡
              </span>
              <h3 className="mt-2 font-heading text-lg font-semibold">{c.cardTitle}</h3>
              <p className="mt-2 text-sm text-ink-2">{c.cardText}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  WhatsApp
                </a>
                <a href={`mailto:${CONTACT.email}`} className="btn btn-outline">
                  Email
                </a>
              </div>
            </div>
          </div>

          {/* ─── Formulario → WhatsApp ─── */}
          <div className="surface-card p-7">
            <h2 className="font-heading text-xl font-semibold">{c.formTitle}</h2>
            <p className="mt-2 text-sm text-ink-2">{c.formSubtitle}</p>

            <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  id="contactName"
                  label={c.name}
                  placeholder={c.namePlaceholder}
                  value={values.name}
                  onChange={update('name')}
                  required
                />
                <Field
                  id="contactEmail"
                  type="email"
                  label={c.email}
                  placeholder={c.emailPlaceholder}
                  value={values.email}
                  onChange={update('email')}
                />
              </div>

              <div>
                <label htmlFor="contactService" className="mb-1.5 block text-sm font-medium text-ink">
                  {c.service}
                </label>
                <select
                  id="contactService"
                  value={values.service}
                  onChange={update('service')}
                  className="w-full rounded-sm border border-line bg-bg px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-brand"
                >
                  {SERVICE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.value === ''}>
                      {tr(option.label, lang)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="contactMessage"
                  className="mb-1.5 block text-sm font-medium text-ink"
                >
                  {c.message}
                </label>
                <textarea
                  id="contactMessage"
                  rows={5}
                  placeholder={c.messagePlaceholder}
                  value={values.message}
                  onChange={update('message')}
                  className="w-full resize-y rounded-sm border border-line bg-bg px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-brand"
                />
              </div>

              {/* Trampa anti-spam: oculta para personas, tentadora para bots.
                  Se colapsa en el input mismo para que no ocupe espacio real. */}
              <div aria-hidden="true" className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0">
                <label htmlFor="contactCompany">{c.company}</label>
                <input
                  id="contactCompany"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  className="h-0 w-0 border-0 p-0 opacity-0"
                  value={honeypot}
                  onChange={(event) => setHoneypot(event.target.value)}
                />
              </div>

              {error ? (
                <p role="alert" className="text-sm text-red-400">
                  {error}
                </p>
              ) : null}

              <button type="submit" className="btn btn-primary w-full">
                {c.submit}
              </button>

              <p className="text-xs leading-relaxed text-ink-muted">{c.note}</p>
            </form>

            <p className="mt-4 text-sm text-ink-2">
              {c.alt}{' '}
              <a
                href={`mailto:${CONTACT.email}`}
                className="text-brand-text underline underline-offset-2"
              >
                {CONTACT.email}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="border-t border-line py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="section-label">{c.faqLabel}</p>
            <h2 className="section-title mt-3">{c.faqTitle}</h2>
            <p className="section-desc mt-4">{c.faqText}</p>
          </div>
          <FAQList items={FAQ} lang={lang} />
        </div>
      </section>
    </>
  );
}

function Field({ id, label, type = 'text', placeholder, value, onChange, required }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-sm border border-line bg-bg px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-brand"
      />
    </div>
  );
}
