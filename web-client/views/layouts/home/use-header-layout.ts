'use client';

import { useTheme } from 'next-themes';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useDebounce from '@/hooks/use-debounce';
import { useState, useEffect, useTransition } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import i18next from '@/locale/i18n';
import i18n from 'i18next';
import { useAuthMutation } from '@/services/mutations/auth';
import cookieUtils from '@/utils/cookieUtils';
import { IChangePasswordRequest } from '@/types/auth';

const useHeaderLayout = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('query') || '');
  const [isShowSearch, setIsShowSearch] = useState(false);
  const [isLoading, startTransition] = useTransition();
  const [currentLang, setCurrentLang] = useState(i18n.language as 'vi' | 'en');

  const debouncedSearch = useDebounce(search, 500);
  const { setStorage } = useLocalStorage();
  const { logoutMutation, changePasswordMutation } = useAuthMutation();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const currentQuery = searchParams.get('query') || '';
    if (debouncedSearch === currentQuery) return;

    if (debouncedSearch.trim() !== '') {
      startTransition(() => {
        router.push(`?query=${debouncedSearch}`);
      });
    } else {
      router.push(pathname);
    }
  }, [debouncedSearch, router, pathname, searchParams]);

  const handleChangeLang = (lang: 'vi' | 'en') => {
    setStorage({ language: lang });
    i18next.changeLanguage(lang);
    setCurrentLang(lang);
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    cookieUtils.deleteStorage();
  };

  const handleChangePassword = async (data: IChangePasswordRequest) => {
    await changePasswordMutation.mutateAsync(data);
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
    handleLogout,
    handleChangePassword,
  };
};

export default useHeaderLayout;
