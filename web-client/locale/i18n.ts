'use client';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

const namespaces = [
  'common',
  'layout',
  'auth',
  'validation',
  'navigation',
  'notification',
  'profile',
  'settings',
] as const;

/* eslint-disable @typescript-eslint/no-require-imports */
const resources = {
  en: Object.fromEntries(namespaces.map(ns => [ns, require(`./en/${ns}.json`)])),
  vi: Object.fromEntries(namespaces.map(ns => [ns, require(`./vi/${ns}.json`)])),
};

const getLanguageFromCookie = (): 'vi' | 'en' => {
  if (typeof document === 'undefined') return 'vi';
  const match = document.cookie.match(/language=(vi|en)/);
  return (match?.[1] as 'vi' | 'en') || 'vi';
};

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    resources,
    fallbackLng: 'vi',
    debug: false,
    interpolation: { escapeValue: false },
    ns: [...namespaces],
    defaultNS: 'common',
    lng: 'vi',
  });
}

export const syncLanguageFromCookie = () => {
  if (typeof window === 'undefined') return;

  const cookieLang = getLanguageFromCookie();
  if (cookieLang !== i18next.language) {
    i18next.changeLanguage(cookieLang);
  }
};

export default i18next;
