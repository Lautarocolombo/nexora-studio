import { useLang } from '../i18n/LanguageContext';
import ProjectShowcase from '../components/portfolio/ProjectShowcase';
import { PROJECTS } from '../data/portfolio';

export default function Portfolio() {
  const { lang } = useLang();
  return <ProjectShowcase projects={PROJECTS} lang={lang} headingLevel={1} />;
}
