import { useEffect } from 'react';
import { Language, TabType } from '../types';

const SEO_DATA: Record<TabType, { title: Record<Language, string>; description: Record<Language, string> }> = {
  wardrobe: {
    title: { es: 'Guardarropa — Armario', en: 'Wardrobe — Armario' },
    description: { es: 'Organizá tu armario, medí tus usos y armá conjuntos con estilo editorial.', en: 'Organize your wardrobe, track wears, and build outfits with editorial style.' },
  },
  builder: {
    title: { es: 'Constructor de Conjuntos — Armario', en: 'Outfit Builder — Armario' },
    description: { es: 'Combiná piezas de tu armario y medí la armonía del conjunto.', en: 'Combine pieces from your wardrobe and measure outfit harmony.' },
  },
  calendar: {
    title: { es: 'Calendario — Armario', en: 'Calendar — Armario' },
    description: { es: 'Planificá rotaciones y audita tu historial real de uso diario.', en: 'Plan capsule rotations and audit your true daily wear history.' },
  },
  stats: {
    title: { es: 'Estadísticas — Armario', en: 'Stats — Armario' },
    description: { es: 'Medí qué tan seguido usás cada pieza y descubrí combinaciones frecuentes.', en: 'Track how often you wear each piece and discover frequent combinations.' },
  },
  profile: {
    title: { es: 'Perfil — Armario', en: 'Profile — Armario' },
    description: { es: 'Configurá tu cuenta y preferencias del guardarropa.', en: 'Configure your account and wardrobe preferences.' },
  },
  help: {
    title: { es: 'Ayuda — Armario', en: 'Help — Armario' },
    description: { es: 'Guía de uso y preguntas frecuentes de Armario.', en: 'Usage guide and FAQ for Armario.' },
  },
  admin: {
    title: { es: 'Administración — Armario', en: 'Admin — Armario' },
    description: { es: 'Panel de administración del guardarropa.', en: 'Wardrobe administration panel.' },
  },
  audit: {
    title: { es: 'Auditoría — Armario', en: 'Audit — Armario' },
    description: { es: 'Panel de auditoría y métricas del sistema.', en: 'System audit panel and metrics.' },
  },
};

export function useSeoMeta(activeTab: TabType, language: Language) {
  useEffect(() => {
    const data = SEO_DATA[activeTab] || SEO_DATA.wardrobe;
    const title = data.title[language];
    const description = data.description[language];

    document.title = `${title} | Outfitmatic`;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', description);
    }

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) {
      twDesc.setAttribute('content', description);
    }
  }, [activeTab, language]);
}
