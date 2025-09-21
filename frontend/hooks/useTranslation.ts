import { useState, useEffect } from 'react';
import es from '../locales/es.json';
import en from '../locales/en.json';

const translations = { es, en };

export const useTranslation = () => {
  const [locale, setLocale] = useState('es');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') || 'es';
    setLocale(savedLocale);
  }, []);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[locale as keyof typeof translations];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  const changeLocale = (newLocale: string) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  return { t, locale, changeLocale };
};