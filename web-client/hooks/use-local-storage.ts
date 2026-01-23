'use client';

import { APP_KEY } from '@/utils/cookieUtils';

const useLocalStorage = () => {
  const isBrowser = typeof window !== 'undefined';

  const getItem = (): Record<string, unknown> => {
    if (!isBrowser) return {};
    try {
      const data = window.localStorage.getItem(APP_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  };

  const setItem = (objectSet: Record<string, unknown>) => {
    if (!isBrowser) return;
    const data = getItem();
    const newData = { ...data, ...objectSet };
    window.localStorage.setItem(APP_KEY, JSON.stringify(newData));
  };

  const deleteItem = (item: string) => {
    if (!isBrowser || !item) return;
    const data = getItem();
    if (data && typeof data === 'object') {
      delete data[item];
      window.localStorage.setItem(APP_KEY, JSON.stringify(data));
    }
  };

  return {
    dataStorage: getItem,
    setStorage: setItem,
    deleteStorage: deleteItem,
  };
};

export default useLocalStorage;
