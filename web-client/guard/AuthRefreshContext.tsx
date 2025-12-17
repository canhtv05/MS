'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthRefreshContextType {
  isRefreshing: boolean;
}

const AuthRefreshContext = createContext<AuthRefreshContextType>({
  isRefreshing: false,
});

let globalSetIsRefreshing: (value: boolean) => void = () => {};

export const useAuthRefresh = () => useContext(AuthRefreshContext);

export const setAuthRefreshing = (value: boolean) => {
  globalSetIsRefreshing(value);
};

export const AuthRefreshProvider = ({ children }: { children: ReactNode }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    globalSetIsRefreshing = setIsRefreshing;
  }, []);

  return (
    <AuthRefreshContext.Provider value={{ isRefreshing }}>{children}</AuthRefreshContext.Provider>
  );
};
