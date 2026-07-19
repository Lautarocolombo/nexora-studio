import { createContext } from 'react';
import { Language } from '../types';

export interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);
