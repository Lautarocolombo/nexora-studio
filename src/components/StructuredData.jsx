import { SITE_CONFIG } from '../lib/siteConfig';

/**
 * Datos estructurados JSON-LD (schema.org) para que los buscadores
 * entiendan qué es el negocio. El sitio legacy los tenía declarados en
 * el HTML estático; al migrar a SPA hay que inyectarlos desde React.
 */
const ORG = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Nexora Studio',
  url: SITE_CONFIG.siteUrl,
  description:
    'Diseño y desarrollo web a medida para PyMEs y emprendedores del interior de Argentina.',
  email: 'contacto@nexorastudio.com',
  telephone: '+54-9-3444-51-7496',
  areaServed: 'AR',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Gualeguay',
    addressRegion: 'Entre Ríos',
    addressCountry: 'AR',
  },
  sameAs: [],
  knowsLanguage: ['es', 'en'],
};

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      // Contenido estático del proyecto, no input de usuario.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG) }}
    />
  );
}

export default StructuredData;
