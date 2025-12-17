'use client';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonEN from './en/common.json';
import commonVI from './vi/common.json';
import layoutEN from './en/layout.json';
import layoutVI from './vi/layout.json';
import authEN from './en/auth.json';
import authVI from './vi/auth.json';
import validationEN from './en/validation.json';
import validationVI from './vi/validation.json';
import navigationEN from './en/navigation.json';
import navigationVI from './vi/navigation.json';
import notificationEN from './en/notification.json';
import notificationVI from './vi/notification.json';
import profileEN from './en/profile.json';
import profileVI from './vi/profile.json';
import { APP_KEY } from '@/utils/cookieUtils';

// the translations
const resources = {
  en: {
    auth: authEN,
    validation: validationEN,
    common: commonEN,
    layout: layoutEN,
    navigation: navigationEN,
    notification: notificationEN,
    profile: profileEN,
  },
  vi: {
    auth: authVI,
    validation: validationVI,
    common: commonVI,
    layout: layoutVI,
    navigation: navigationVI,
    notification: notificationVI,
    profile: profileVI,
  },
};

let currentLang: 'vi' | 'en' = 'vi';

if (typeof window !== 'undefined') {
  const json = localStorage.getItem(APP_KEY);
  let dataStorage: { language?: string } = {};

  if (json) {
    try {
      dataStorage = JSON.parse(json);
    } catch {
      dataStorage = {};
    }
  }

  if (!dataStorage.language) {
    dataStorage.language = 'vi';
    localStorage.setItem(APP_KEY, JSON.stringify(dataStorage));
  }

  currentLang = dataStorage.language! as 'vi' | 'en';
}

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    resources,
    fallbackLng: 'vi',
    debug: false,
    interpolation: { escapeValue: false },
    ns: ['auth', 'validation', 'common', 'layout', 'navigation', 'profile'],
    defaultNS: 'common',
    lng: 'vi', // default language SSR
  });
}

export { currentLang };
export default i18next;
