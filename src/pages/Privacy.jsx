import Legal from './Legal';
import { PRIVACY_SECTIONS } from '../data/site';
import { useLang } from '../i18n/LanguageContext';

const COPY = {
  es: {
    eyebrow: 'Legal',
    title: 'Política de Privacidad',
    subtitle: 'Tu privacidad importa. Te explicamos de forma clara qué datos manejamos y por qué.',
  },
  en: {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    subtitle: 'Your privacy matters. Here we clearly explain what data we handle and why.',
  },
};

export default function Privacy() {
  const { lang } = useLang();
  const c = COPY[lang] ?? COPY.es;

  return (
    <Legal
      lang={lang}
      eyebrow={c.eyebrow}
      title={c.title}
      subtitle={c.subtitle}
      sections={PRIVACY_SECTIONS}
    />
  );
}
