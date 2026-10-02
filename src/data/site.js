/**
 * NEXORA STUDIO — Contenido de las páginas (es/en)
 * Texto portado 1:1 de los HTML legacy, para que no se pierda nada
 * al migrar. Editá acá y el sitio se actualiza.
 */

export const CONTACT = {
  email: 'contacto@nexorastudio.com',
  whatsappNumber: '5493444517496',
  whatsappDisplay: '+54 9 3444 51-7496',
  whatsappPrefill:
    'Hola%20Nexora%20Studio%2C%20quiero%20consultar%20por%20un%20proyecto%20web',
};

/** Las 4 tarjetas de servicios con precio y plazo. */
export const SERVICES = [
  {
    id: 'landing',
    icon: '🚀',
    featured: false,
    name: { es: 'Landing Pages', en: 'Landing Pages' },
    desc: {
      es: 'Páginas de conversión rápida, enfocadas en capturar leads y comunicar el valor de tu producto o servicio con claridad.',
      en: 'Fast conversion pages focused on capturing leads and communicating your value with clarity.',
    },
    includes: {
      es: ['Copy estratégico', 'Diseño móvil primero', 'Velocidad y SEO', 'Integración con formularios y chat'],
      en: ['Strategic copy', 'Mobile-first design', 'Speed and SEO', 'Forms and chat integration'],
    },
    priceFrom: { es: 'Desde', en: 'From' },
    price: 350,
    time: { es: '⏱ 3–5 días', en: '⏱ 3–5 days' },
    cta: { es: 'Solicitar landing', en: 'Request landing' },
  },
  {
    id: 'sitio',
    icon: '🏢',
    featured: true,
    name: { es: 'Sitios Corporativos', en: 'Corporate Sites' },
    desc: {
      es: 'Sitios corporativos y de marca donde tu historia, catálogo de servicios y propuestas se muestran con profesionalismo.',
      en: 'Corporate and brand sites where your story, catalog and offers are shown with professionalism.',
    },
    includes: {
      es: ['Secciones personalizadas', 'Blog o noticias', 'SEO técnico', 'Responsive real'],
      en: ['Custom sections', 'Blog or news', 'Technical SEO', 'True responsive'],
    },
    priceFrom: { es: 'Desde', en: 'From' },
    price: 750,
    time: { es: '⏱ 7–12 días', en: '⏱ 7–12 days' },
    cta: { es: 'Solicitar sitio', en: 'Request site' },
  },
  {
    id: 'tienda',
    icon: '🛒',
    featured: false,
    name: { es: 'Tiendas Online', en: 'Online Stores' },
    desc: {
      es: 'eCommerce escalable y fácil de gestionar, con pasarelas de pago, catálogo y experiencia de compra moderna.',
      en: 'Scalable, easy-to-manage eCommerce with payment gateways, catalog and a modern shopping experience.',
    },
    includes: {
      es: ['MercadoPago / Stripe', 'Administración de productos', 'Checkout optimizado', 'SEO para eCommerce'],
      en: ['MercadoPago / Stripe', 'Product management', 'Optimized checkout', 'eCommerce SEO'],
    },
    priceFrom: { es: 'Desde', en: 'From' },
    price: 1200,
    time: { es: '⏱ 10–18 días', en: '⏱ 10–18 days' },
    cta: { es: 'Solicitar tienda', en: 'Request store' },
  },
  {
    id: 'app',
    icon: '⚙️',
    featured: false,
    name: { es: 'Apps y Sistemas', en: 'Apps & Systems' },
    desc: {
      es: 'Sistemas web a medida, dashboards, CRM y aplicaciones internas con una experiencia clara para tus usuarios.',
      en: 'Custom web systems, dashboards, CRM and internal applications with a clear experience for your users.',
    },
    includes: {
      es: ['API y backend escalable', 'Integración con herramientas', 'Interfaces intuitivas', 'Mantenimiento opcional'],
      en: ['Scalable API and backend', 'Tool integration', 'Intuitive interfaces', 'Optional maintenance'],
    },
    priceFrom: { es: 'Desde', en: 'From' },
    price: 2000,
    time: { es: '⏱ Consultar', en: '⏱ On request' },
    cta: { es: 'Consultar proyecto', en: 'Discuss a project' },
  },
];

/** Proceso de trabajo en 5 pasos (compartido por Servicios y Nosotros). */
export const PROCESS = [
  {
    number: '01',
    icon: '💬',
    title: { es: 'Brief y estrategia', en: 'Brief and strategy' },
    desc: {
      es: 'Definimos objetivos, público, tono de marca y mensaje clave.',
      en: 'We define goals, audience, brand tone and key message.',
    },
  },
  {
    number: '02',
    icon: '🎨',
    title: { es: 'Diseño propio', en: 'Custom design' },
    desc: {
      es: 'Creamos una estética única alineada a tu identidad y diferencial.',
      en: 'We create a unique look aligned with your identity and edge.',
    },
  },
  {
    number: '03',
    icon: '⚙️',
    title: { es: 'Desarrollo', en: 'Development' },
    desc: {
      es: 'Codificamos con tecnologías rápidas y escalables, pensando en el futuro.',
      en: 'We code with fast, scalable technologies, thinking ahead.',
    },
  },
  {
    number: '04',
    icon: '✅',
    title: { es: 'Revisión', en: 'Review' },
    desc: {
      es: 'Ajustamos detalles según tu feedback hasta dejar todo perfecto.',
      en: 'We polish details based on your feedback until everything is right.',
    },
  },
  {
    number: '05',
    icon: '🚀',
    title: { es: 'Lanzamiento', en: 'Launch' },
    desc: {
      es: 'Publicamos tu sitio y entregamos soporte inicial para arrancar sin problemas.',
      en: 'We publish your site and provide initial support so you start smoothly.',
    },
  },
];

/** Los 4 diferenciales de Nexora (página Nosotros). */
export const VALUES = [
  {
    icon: '🎨',
    name: { es: 'Diseño propio', en: 'Custom design' },
    desc: {
      es: 'Cada proyecto nace de tu identidad. Nada de plantillas genéricas: estética, estructura y mensaje a medida.',
      en: 'Every project is born from your identity. No generic templates: aesthetics, structure and message tailored to you.',
    },
  },
  {
    icon: '⚙️',
    name: { es: 'Código limpio', en: 'Clean code' },
    desc: {
      es: 'Desarrollo con tecnologías modernas y escalables, pensado para que el sitio crezca con tu negocio.',
      en: 'Development with modern, scalable technologies, built so your site grows with your business.',
    },
  },
  {
    icon: '🤝',
    name: { es: 'Acompañamiento', en: 'Accompaniment' },
    desc: {
      es: 'Te guiamos en cada etapa y seguimos cerca después del lanzamiento, con respuestas en menos de 24 horas.',
      en: 'We guide you at every stage and stay close after launch, with responses within 24 hours.',
    },
  },
  {
    icon: '💡',
    name: { es: 'Precio justo', en: 'Fair price' },
    desc: {
      es: 'Presupuestos claros en USD, sin sorpresas. Sabés qué incluye y cuánto cuesta antes de empezar.',
      en: 'Clear quotes in USD, no surprises. You know what is included and the cost before we start.',
    },
  },
];

export const STATS = [
  { value: '40+', label: { es: 'Proyectos entregados', en: 'Projects delivered' } },
  { value: '<24h', label: { es: 'Tiempo de respuesta', en: 'Response time' } },
  { value: '100%', label: { es: 'Remoto y flexible', en: 'Remote and flexible' } },
];

/** Testimonios de la home (página de clientes). */
export const TESTIMONIALS = [
  {
    quote: {
      es: '“Nexora Studio entendió nuestro negocio y entregó un sitio que superó expectativas. Vendimos más desde el lanzamiento.”',
      en: '“Nexora Studio understood our business and delivered a site that exceeded expectations. We sold more from launch day.”',
    },
    name: 'María R.',
    role: { es: 'Comercio minorista', en: 'Retail' },
  },
  {
    quote: {
      es: '“La tienda online quedó impecable y fácil de administrar. Soporte rápido y propuestas que sumaron valor.”',
      en: '“The online store came out flawless and easy to manage. Fast support and proposals that added real value.”',
    },
    name: 'Juan P.',
    role: { es: 'Emprendedor', en: 'Entrepreneur' },
  },
  {
    quote: {
      es: '“Pasamos de una app móvil a web sin perder identidad. Profesionales y muy organizados.”',
      en: '“We moved from a mobile app to the web without losing our identity. Professional and very organised.”',
    },
    name: 'Lucía G.',
    role: { es: 'Producto propio', en: 'Own product' },
  },
];

/** Las 4 mini-tarjetas de servicio de la home (con su CTA a /servicios). */
export const HOME_SERVICES = [
  {
    icon: '🚀',
    name: { es: 'Landing Pages', en: 'Landing Pages' },
    desc: {
      es: 'Páginas de conversión rápidas, enfocadas en captar leads y comunicar tu valor con claridad.',
      en: 'Fast conversion pages focused on capturing leads and communicating your value with clarity.',
    },
    featured: false,
  },
  {
    icon: '🏢',
    name: { es: 'Sitios Corporativos', en: 'Corporate Sites' },
    desc: {
      es: 'Sitios de marca donde tu historia, servicios y propuestas se muestran con profesionalismo.',
      en: 'Brand sites where your story, services and offers are shown with professionalism.',
    },
    featured: true,
  },
  {
    icon: '🛒',
    name: { es: 'Tiendas Online', en: 'Online Stores' },
    desc: {
      es: 'eCommerce escalable y fácil de gestionar, con pasarelas de pago y experiencia de compra moderna.',
      en: 'Scalable, easy-to-manage eCommerce with payment gateways and a modern shopping experience.',
    },
    featured: false,
  },
  {
    icon: '⚙️',
    name: { es: 'Apps y Sistemas', en: 'Apps & Systems' },
    desc: {
      es: 'Sistemas web a medida, dashboards y aplicaciones internas con una experiencia clara.',
      en: 'Custom web systems, dashboards and internal applications with a clear experience.',
    },
    featured: false,
  },
];

export const CONTACT_ITEMS = [
  { icon: '📧', title: { es: 'Email', en: 'Email' }, text: CONTACT.email },
  {
    icon: '💬',
    title: { es: 'WhatsApp', en: 'WhatsApp' },
    text: {
      es: `${CONTACT.whatsappDisplay} · Respuesta rápida`,
      en: `${CONTACT.whatsappDisplay} · Fast response`,
    },
  },
  {
    icon: '📍',
    title: { es: 'Ubicación', en: 'Location' },
    text: {
      es: 'Gualeguay, Entre Ríos, Argentina · 100% remoto',
      en: 'Gualeguay, Entre Ríos, Argentina · 100% remote',
    },
  },
  {
    icon: '⏱️',
    title: { es: 'Horario', en: 'Hours' },
    text: {
      es: 'Lun - Vie · 9:00 a 19:00 (GMT-3)',
      en: 'Mon - Fri · 9:00 to 19:00 (GMT-3)',
    },
  },
];

/** Opciones del <select> del formulario. El value viaja a WhatsApp. */
export const SERVICE_OPTIONS = [
  { value: '', label: { es: 'Elegí un servicio', en: 'Choose a service' } },
  { value: 'Landing Page', label: { es: 'Landing Page', en: 'Landing Page' } },
  { value: 'Sitio Corporativo', label: { es: 'Sitio Corporativo', en: 'Corporate Site' } },
  { value: 'Tienda Online', label: { es: 'Tienda Online', en: 'Online Store' } },
  { value: 'App o Sistema', label: { es: 'App o Sistema', en: 'App or System' } },
  { value: 'Otro', label: { es: 'Otro', en: 'Other' } },
];

export const FAQ = [
  {
    q: {
      es: '¿Qué incluye el presupuesto?',
      en: 'What does the quote include?',
    },
    a: {
      es: 'El presupuesto incluye diseño, desarrollo, pruebas, ajustes y publicación en el servidor. Si necesitás branding o eCommerce puede sumar servicios adicionales.',
      en: 'The quote includes design, development, testing, adjustments and publishing on the server. If you need branding or eCommerce, additional services may apply.',
    },
  },
  {
    q: {
      es: '¿Cuánto tarda el desarrollo?',
      en: 'How long does development take?',
    },
    a: {
      es: 'Una landing page puede entregarse en 3–5 días, un sitio institucional en 7–12 días y una tienda o app en 2–4 semanas, según complejidad.',
      en: 'A landing page can be delivered in 3–5 days, a corporate site in 7–12 days, and a store or app in 2–4 weeks, depending on complexity.',
    },
  },
  {
    q: {
      es: '¿Necesito contenido listo?',
      en: 'Do I need content ready?',
    },
    a: {
      es: 'Podemos trabajar a partir de tu contenido o ayudarte a definir textos y estructura si preferís enfocarte en tu negocio.',
      en: 'We can work from your content or help you define copy and structure if you prefer to focus on your business.',
    },
  },
];

const UPDATED = {
  es: 'Última actualización: julio de 2026. Plantilla base sujeta a revisión de tu asesor legal.',
  en: 'Last updated: July 2026. Base template subject to review by your legal advisor.',
};

const MAIL = `mailto:${CONTACT.email}`;

/** Secciones de la Política de Privacidad (números ya escritos en el título). */
export const PRIVACY_SECTIONS = [
  {
    title: { es: '1. Responsable', en: '1. Controller' },
    body: {
      es: [
        { t: 'p', html: `<strong>Nexora Studio</strong> ([CUIT], domicilio en Gualeguay, Entre Ríos, Argentina) es el responsable del tratamiento de los datos personales que nos facilitás a través de este sitio y nuestros canales de contacto.` },
      ],
      en: [
        { t: 'p', html: `<strong>Nexora Studio</strong> ([CUIT], based in Gualeguay, Entre Ríos, Argentina) is the controller of the personal data you provide through this site and our contact channels.` },
      ],
    },
  },
  {
    title: { es: '2. Datos que recopilamos', en: '2. Data we collect' },
    body: {
      es: [
        {
          t: 'ul',
          items: [
            'Datos de contacto que nos envías voluntariamente (nombre, email, teléfono/WhatsApp, mensaje).',
            'Información del proyecto o consulta que nos compartís.',
            'Datos técnicos de navegación no identificatorios (tipo de dispositivo, país aproximado, páginas visitadas) mediante cookies propias o de analítica.',
          ],
        },
      ],
      en: [
        {
          t: 'ul',
          items: [
            'Contact data you voluntarily send us (name, email, phone/WhatsApp, message).',
            'Information about the project or enquiry you share with us.',
            'Non-identifying technical browsing data (device type, approximate country, pages visited) through our own cookies or analytics.',
          ],
        },
      ],
    },
  },
  {
    title: { es: '3. Finalidad', en: '3. Purpose' },
    body: {
      es: [
        { t: 'p', html: 'Utilizamos tus datos para responder consultas, preparar presupuestos, prestar y mejorar nuestros servicios, y cumplir obligaciones legales. No vendemos ni cedemos tus datos a terceros con fines comerciales.' },
      ],
      en: [
        { t: 'p', html: 'We use your data to answer enquiries, prepare quotes, deliver and improve our services, and meet legal obligations. We do not sell or transfer your data to third parties for commercial purposes.' },
      ],
    },
  },
  {
    title: { es: '4. Base legal', en: '4. Legal basis' },
    body: {
      es: [
        { t: 'p', html: `El tratamiento se fundamenta en tu consentimiento, la relación precontractual/contractual y el cumplimiento de obligaciones legales, conforme a la <strong>Ley N.º 25.326</strong> de Protección de Datos Personales de la República Argentina.` },
      ],
      en: [
        { t: 'p', html: `Processing is based on your consent, the precontractual/contractual relationship and compliance with legal obligations, under <strong>Law No. 25.326</strong> on Personal Data Protection of the Argentine Republic.` },
      ],
    },
  },
  {
    title: { es: '5. Tus derechos (Hábeas Data)', en: '5. Your rights (Habeas Data)' },
    body: {
      es: [
        { t: 'p', html: `Podés en cualquier momento ejercer tus derechos de acceso, rectificación, actualización, confidencialidad y supresión (ARCO) escribiéndonos a <a href="${MAIL}">${CONTACT.email}</a>. Ante una respuesta insatisfactoria, podés dirigirte a la Agencia de Acceso a la Información Pública.` },
      ],
      en: [
        { t: 'p', html: `You may at any time exercise your rights of access, rectification, update, confidentiality and deletion by writing to <a href="${MAIL}">${CONTACT.email}</a>. If the response is unsatisfactory, you may contact the Public Information Access Agency.` },
      ],
    },
  },
  {
    title: { es: '6. Conservación', en: '6. Retention' },
    body: {
      es: [
        { t: 'p', html: 'Conservamos tus datos solo el tiempo necesario para las finalidades descriptas o según exija la normativa aplicable, y los eliminamos cuando ya no son necesarios.' },
      ],
      en: [
        { t: 'p', html: 'We keep your data only for as long as necessary for the purposes described or as required by applicable law, and delete it when it is no longer needed.' },
      ],
    },
  },
  {
    title: { es: '7. Cookies', en: '7. Cookies' },
    body: {
      es: [
        { t: 'p', html: 'Este sitio puede utilizar cookies para mejorar la experiencia y medir el tráfico. Podés configurar tu navegador para rechazarlas; algunas funciones podrían verse afectadas.' },
      ],
      en: [
        { t: 'p', html: 'This site may use cookies to improve the experience and measure traffic. You can configure your browser to reject them; some features may be affected.' },
      ],
    },
  },
  {
    title: { es: '8. Contacto', en: '8. Contact' },
    body: {
      es: [{ t: 'p', html: `Para cualquier duda sobre esta política: <a href="${MAIL}">${CONTACT.email}</a>.` }],
      en: [{ t: 'p', html: `For any questions about this policy: <a href="${MAIL}">${CONTACT.email}</a>.` }],
    },
  },
];

/** Secciones de los Términos de Servicio. */
export const TERMS_SECTIONS = [
  {
    title: { es: '1. Aceptación', en: '1. Acceptance' },
    body: {
      es: [
        { t: 'p', html: 'Al contratar nuestros servicios aceptás los presentes términos. Cualquier condición distinta será válida solo si se acuerda por escrito.' },
      ],
      en: [
        { t: 'p', html: 'By hiring our services you accept these terms. Any different condition is only valid if agreed in writing.' },
      ],
    },
  },
  {
    title: { es: '2. Servicios', en: '2. Services' },
    body: {
      es: [
        { t: 'p', html: 'Nexora Studio ofrece diseño y desarrollo web (landing pages, sitios corporativos, tiendas online y sistemas a medida). El alcance, tiempos y precio se definen en cada presupuesto o contrato específico.' },
      ],
      en: [
        { t: 'p', html: 'Nexora Studio provides web design and development (landing pages, corporate sites, online stores and custom systems). Scope, timelines and price are defined in each specific quote or contract.' },
      ],
    },
  },
  {
    title: { es: '3. Presupuestos y pagos', en: '3. Quotes and payments' },
    body: {
      es: [
        {
          t: 'ul',
          items: [
            'Los presupuestos son informativos y no obligan a ninguna parte hasta su aceptación.',
            'Las formas y cuotas de pago se acuerdan por escrito (seña, hitos y saldo).',
            'Los precios se expresan en USD salvo indicación contraria y no incluyen impuestos salvo que se especifique.',
          ],
        },
      ],
      en: [
        {
          t: 'ul',
          items: [
            'Quotes are informative and bind neither party until accepted.',
            'Payment methods and instalments are agreed in writing (deposit, milestones and balance).',
            'Prices are expressed in USD unless otherwise stated and do not include taxes unless specified.',
          ],
        },
      ],
    },
  },
  {
    title: { es: '4. Responsabilidades del cliente', en: '4. Client responsibilities' },
    body: {
      es: [
        { t: 'p', html: 'El cliente debe aportar la información, contenidos y accesos necesarios en tiempo y forma. La demora en su entrega puede extender los plazos de entrega.' },
      ],
      en: [
        { t: 'p', html: 'The client must provide the necessary information, content and access in a timely manner. Delays may extend the delivery timeline.' },
      ],
    },
  },
  {
    title: { es: '5. Propiedad intelectual', en: '5. Intellectual property' },
    body: {
      es: [
        { t: 'p', html: 'Una vez liquidado el saldo total, se cede al cliente la titularidad del código y diseños entregados, salvo componentes de terceros sujetos a sus propias licencias. Nexora Studio puede exhibir el trabajo en su portfolio.' },
      ],
      en: [
        { t: 'p', html: 'Once the full balance is paid, ownership of the delivered code and designs is transferred to the client, except for third-party components subject to their own licenses. Nexora Studio may showcase the work in its portfolio.' },
      ],
    },
  },
  {
    title: { es: '6. Limitación de responsabilidad', en: '6. Limitation of liability' },
    body: {
      es: [
        { t: 'p', html: 'El servicio se presta con criterio profesional. No garantizamos resultados de negocio específicos (ventas, posicionamiento) y nuestra responsabilidad se limita al valor del servicio contratado.' },
      ],
      en: [
        { t: 'p', html: 'The service is provided with professional care. We do not guarantee specific business results (sales, rankings) and our liability is limited to the value of the service hired.' },
      ],
    },
  },
  {
    title: { es: '7. Legislación aplicable', en: '7. Governing law' },
    body: {
      es: [
        { t: 'p', html: 'Estos términos se rigen por las leyes de la República Argentina. Para cualquier controversia, las partes se someten a los tribunales de [domicilio], salvo norma imperativa en contrario.' },
      ],
      en: [
        { t: 'p', html: 'These terms are governed by the laws of the Argentine Republic. Any dispute will be submitted to the courts of [domicile], except where an imperative rule states otherwise.' },
      ],
    },
  },
  {
    title: { es: '8. Contacto', en: '8. Contact' },
    body: {
      es: [{ t: 'p', html: `Consultas sobre estos términos: <a href="${MAIL}">${CONTACT.email}</a>.` }],
      en: [{ t: 'p', html: `Questions about these terms: <a href="${MAIL}">${CONTACT.email}</a>.` }],
    },
  },
];

export const UPDATED_NOTE = UPDATED;

/** Texto de un campo bilingüe. */
export const t = (field, lang) => {
  if (field == null) return '';
  if (typeof field === 'string') return field;
  return field[lang] ?? field.es;
};
