'use client';

import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import useDebounce from '@/hooks/use-debounce';
import { useState, useEffect, useTransition } from 'react';

const useHomeHeaderLayout = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [isShowSearch, setIsShowSearch] = useState(false);
  const [isLoading, startTransition] = useTransition();

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
  };
};

export default useHomeHeaderLayout;
