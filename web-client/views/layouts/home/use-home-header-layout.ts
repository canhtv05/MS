'use client';

import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import useDebounce from '@/hooks/use-debounce';
import { useState, useEffect, useTransition } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import i18next from '@/locale/i18n';
import i18n from 'i18next';

const useHomeHeaderLayout = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [isShowSearch, setIsShowSearch] = useState(false);
  const [isLoading, startTransition] = useTransition();
  const { setStorage } = useLocalStorage();
  const [currentLang, setCurrentLang] = useState(i18n.language as 'vi' | 'en');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (debouncedSearch.trim() !== '') {
      startTransition(() => {
        router.push(`?query=${debouncedSearch}`);
      });
    } else {
      router.push(pathname);
    }
  }, [debouncedSearch, router, pathname]);

  useEffect(() => {
    setIsShowSearch(debouncedSearch.trim() !== '');
  }, [debouncedSearch]);

  const handleChangeLang = (lang: 'vi' | 'en') => {
    setStorage({ language: lang });
    i18next.changeLanguage(lang);
    setCurrentLang(lang);
  };

  return {
    theme,
    setTheme,
    router,
    search,
    setSearch,
    handleSearch,
    isShowSearch,
    setIsShowSearch,
    isLoading,
    debouncedSearch,
    handleChangeLang,
    currentLang,
  };
};

export default useHomeHeaderLayout;
