import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext({ lang: 'es', setLang: () => {} });

const STORAGE_KEY = 'nexora-lang';

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'es' || stored === 'en') return stored;
    } catch {
      /* localStorage bloqueado: usamos el default */
    }
    return 'es';
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* sin persistencia disponible */
    }
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang: (next) => setLangState(next === 'en' ? 'en' : 'es'),
      isEn: lang === 'en',
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLang = () => useContext(LanguageContext);
