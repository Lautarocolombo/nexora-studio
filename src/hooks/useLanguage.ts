import { useContext } from 'react';
import { LanguageContext } from './LanguageContext';

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return { language: 'es' as const, setLanguage: () => {} };
  }
  return context;
}
