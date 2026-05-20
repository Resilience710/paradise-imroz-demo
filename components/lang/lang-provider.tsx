'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

type Lang = 'tr' | 'en';

type LangContextValue = {
  lang: Lang;
  toggle: () => void;
  t: (tr: string, en: string) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('tr');

  useEffect(() => {
    const stored = (typeof window !== 'undefined' && (localStorage.getItem('lang') as Lang)) || 'tr';
    setLang(stored);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.classList.toggle('lang-tr', lang === 'tr');
    document.body.classList.toggle('lang-en', lang === 'en');
    document.documentElement.lang = lang;
    try {
      localStorage.setItem('lang', lang);
    } catch {}
  }, [lang]);

  const toggle = useCallback(() => {
    setLang((l) => (l === 'tr' ? 'en' : 'tr'));
  }, []);

  const t = useCallback((tr: string, en: string) => (lang === 'tr' ? tr : en), [lang]);

  return <LangContext.Provider value={{ lang, toggle, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}

export function T({ tr, en }: { tr: string; en: string }) {
  const { lang } = useLang();
  return <>{lang === 'tr' ? tr : en}</>;
}
