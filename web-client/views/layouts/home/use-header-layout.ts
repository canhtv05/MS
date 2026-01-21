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
import { useAuthStore } from '@/stores/auth';

const useHeaderLayout = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const user = useAuthStore(s => s.user);

  const [search, setSearch] = useState(searchParams.get('query') || '');
  const [isShowSearch, setIsShowSearch] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        if (user?.auth?.username) {
          router.push(`/user/@${user.auth.username}`);
        }
      } else if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        setOpenLogout(true);
      } else if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        e.stopPropagation();
        setIsShowSearch(true);
        const searchInput = document.getElementById('search');
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [router, user?.auth?.username]);

  const handleChangeLang = (lang: 'vi' | 'en') => {
    document.cookie = `language=${lang}; path=/; max-age=31536000`;
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
    setOpenLogout,
    openLogout,
  };
};

export default useHeaderLayout;
