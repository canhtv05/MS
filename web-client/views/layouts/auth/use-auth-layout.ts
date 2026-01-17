'use client';

import { useState } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import i18next from '@/locale/i18n';
import i18n from 'i18next';

const useAuthLayout = () => {
  const [currentLang, setCurrentLang] = useState(i18n.language as 'vi' | 'en');
  const { setStorage } = useLocalStorage();

  const handleChangeLang = (lang: 'vi' | 'en') => {
    document.cookie = `language=${lang}; path=/; max-age=31536000`;
    setStorage({ language: lang });
    i18next.changeLanguage(lang);
    setCurrentLang(lang);
  };

  return {
    handleChangeLang,
    currentLang,
  };
};

export default useAuthLayout;
