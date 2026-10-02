import Legal from './Legal';
import { TERMS_SECTIONS } from '../data/site';
import { useLang } from '../i18n/LanguageContext';

const COPY = {
  es: {
    eyebrow: 'Legal',
    title: 'Términos de Servicio',
    subtitle:
      'Las condiciones bajo las cuales Nexora Studio presta sus servicios de diseño y desarrollo web.',
  },
  en: {
    eyebrow: 'Legal',
    title: 'Terms of Service',
    subtitle: 'The conditions under which Nexora Studio provides its web design and development services.',
  },
};

export default function Terms() {
  const { lang } = useLang();
  const c = COPY[lang] ?? COPY.es;

  return (
    <Legal
      lang={lang}
      eyebrow={c.eyebrow}
      title={c.title}
      subtitle={c.subtitle}
      sections={TERMS_SECTIONS}
    />
  );
}
