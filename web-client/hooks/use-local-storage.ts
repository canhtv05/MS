'use client';

import { APP_KEY } from '@/utils/cookieUtils';

const useLocalStorage = () => {
  const getItem = (): Record<string, unknown> => {
    const data = localStorage.getItem(APP_KEY);
    return data ? JSON.parse(data) : {};
  };

  const setItem = (objectSet: Record<string, unknown>) => {
    const data = getItem();
    const newData = { ...data, ...objectSet };

    localStorage.setItem(APP_KEY, JSON.stringify(newData));
  };

  const deleteItem = (item: string) => {
    if (!item) return;

    const data = getItem();
    if (data && typeof data === 'object') {
      delete data[item];
      localStorage.setItem(APP_KEY, JSON.stringify(data));
    }
  };

  return {
    dataStorage: getItem,
    setStorage: setItem,
    deleteStorage: deleteItem,
  };
};

export default useLocalStorage;
