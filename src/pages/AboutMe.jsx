import { Link } from 'react-router-dom';
import { PageHero, SectionIntro, CTABand } from '../components/ui';
import { useLang } from '../i18n/LanguageContext';
import { t as tr } from '../data/site';

/**
 * Nota: los iconos de la versión HTML en español estaban corruptos
 * (mojibake). Se toman los de la versión en inglés, que sí eran válidos.
 */
const SKILLS = [
  {
    icon: '⚛️',
    name: 'React / Next.js',
    desc: {
      es: 'Interfaces reactivas, SPAs y SSR con ecosistema moderno.',
      en: 'Reactive interfaces, SPAs and SSR with a modern ecosystem.',
    },
  },
  {
    icon: '🟢',
    name: 'Node.js',
    desc: {
      es: 'APIs REST, microservicios y backends escalables.',
      en: 'REST APIs, microservices and scalable backends.',
    },
  },
  {
    icon: '🎨',
    name: 'CSS / Tailwind',
    desc: {
      es: 'Diseño responsive, animaciones y sistemas de diseño.',
      en: 'Responsive design, animations and design systems.',
    },
  },
  {
    icon: '🗄️',
    name: 'PostgreSQL / MongoDB',
    desc: {
      es: 'Modelado de datos, consultas optimizadas y escalabilidad.',
      en: 'Data modelling, optimised queries and scalability.',
    },
  },
  {
    icon: '☁️',
    name: 'Vercel / AWS',
    desc: {
      es: 'Deploy, CI/CD y arquitectura cloud.',
      en: 'Deploys, CI/CD and cloud architecture.',
    },
  },
  {
    icon: '🧪',
    name: 'Testing / QA',
    desc: {
      es: 'Pruebas unitarias, E2E y aseguramiento de calidad.',
      en: 'Unit tests, E2E and quality assurance.',
    },
  },
];

const MY_PROCESS = [
  {
    number: '01',
    icon: '💡',
    title: { es: 'Análisis', en: 'Analysis' },
    desc: {
      es: 'Entiendo el problema, defino alcance y elijo la arquitectura adecuada.',
      en: 'I understand the problem, define scope and choose the right architecture.',
    },
  },
  {
    number: '02',
    icon: '🎯',
    title: { es: 'Diseño', en: 'Design' },
    desc: {
      es: 'Prototipo UX/UI alineado a objetivos de negocio y experiencia de usuario.',
      en: 'UX/UI prototype aligned to business goals and user experience.',
    },
  },
  {
    number: '03',
    icon: '⚙️',
    title: { es: 'Desarrollo', en: 'Development' },
    desc: {
      es: 'Código limpio, testeable y mantenible con stack moderno.',
      en: 'Clean, testable and maintainable code with a modern stack.',
    },
  },
  {
    number: '04',
    icon: '🚀',
    title: { es: 'Deploy', en: 'Deploy' },
    desc: {
      es: 'Publicación optimizada, monitoreo y soporte post-lanzamiento.',
      en: 'Optimised release, monitoring and post-launch support.',
    },
  },
];

const COPY = {
  es: {
    eyebrow: 'Sobre mí',
    titleA: 'Hola, soy',
    titleB: 'Damian Richard',
    subtitle:
      'Desarrollador web Full Stack especializado en crear experiencias digitales a medida. Combino diseño, código limpio y estrategia para construir productos que escalan.',
    ctaProjects: 'Ver proyectos',
    ctaContact: 'Contactarme',
    storyLabel: 'Mi historia',
    storyTitle: 'De la curiosidad por el código a construir productos reales.',
    storyText:
      'Empecé a programar motivado por transformar ideas en herramientas útiles. Hoy me dedico al desarrollo web full stack, trabajando con tecnologías modernas y buenas prácticas para entregar soluciones que funcionan, se ven bien y crecen con el tiempo.',
    stackLabel: 'Stack tecnológico',
    stackTitle: 'Tecnologías y herramientas',
    processLabel: 'Cómo trabajo',
    processTitle: 'Un método simple y probado para llevar tu idea a producción.',
    bandTitle: '¿Tenés un proyecto en mente?',
    bandCta: 'Contactarme',
  },
  en: {
    eyebrow: 'About me',
    titleA: "Hi, I'm",
    titleB: 'Damian Richard',
    subtitle:
      'Full stack web developer specialised in building custom digital experiences. I combine design, clean code and strategy to create products that scale.',
    ctaProjects: 'View projects',
    ctaContact: 'Get in touch',
    storyLabel: 'My story',
    storyTitle: 'From curiosity about code to building real products.',
    storyText:
      'I started programming driven by the urge to turn ideas into useful tools. Today I work on full stack web development, using modern technologies and good practices to deliver solutions that work, look good and grow over time.',
    stackLabel: 'Tech stack',
    stackTitle: 'Technologies and tools',
    processLabel: 'How I work',
    processTitle: 'A simple, proven method to take your idea to production.',
    bandTitle: 'Do you have a project in mind?',
    bandCta: 'Get in touch',
  },
};

export default function AboutMe() {
  const { lang } = useLang();
  const c = COPY[lang] ?? COPY.es;

  return (
    <>
      <PageHero
        eyebrow={c.eyebrow}
        title={
          <>
            {c.titleA} <span className="gradient-text">{c.titleB}</span>
          </>
        }
        subtitle={c.subtitle}
      >
        <Link to="/portfolio" className="btn btn-primary">
          {c.ctaProjects}
        </Link>
        <Link to="/contacto" className="btn btn-outline">
          {c.ctaContact}
        </Link>
      </PageHero>

      <section className="pb-8">
        <div className="container-x">
          <SectionIntro label={c.storyLabel} title={c.storyTitle} description={c.storyText} />
        </div>
      </section>

      {/* ─── Stack ─── */}
      <section className="py-16">
        <div className="container-x">
          <SectionIntro label={c.stackLabel} title={c.stackTitle} className="mb-12" />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SKILLS.map((skill) => (
              <li key={skill.name} className="surface-card p-6 transition hover:bg-card-hover">
                <span aria-hidden="true" className="text-2xl">
                  {skill.icon}
                </span>
                <h2 className="mt-3 font-heading text-base font-semibold">{skill.name}</h2>
                <p className="mt-1.5 text-sm text-ink-2">{tr(skill.desc, lang)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── Método ─── */}
      <section className="pb-20">
        <div className="container-x">
          <SectionIntro label={c.processLabel} title={c.processTitle} className="mb-12" />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {MY_PROCESS.map((step) => (
              <li key={step.number} className="surface-card p-6">
                <span className="font-heading text-sm font-bold text-brand-text-text">{step.number}</span>
                <span aria-hidden="true" className="mt-3 block text-2xl">
                  {step.icon}
                </span>
                <h3 className="mt-3 font-heading text-base font-semibold">{tr(step.title, lang)}</h3>
                <p className="mt-2 text-sm text-ink-2">{tr(step.desc, lang)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTABand title={c.bandTitle} ctaLabel={c.bandCta} />
    </>
  );
}
