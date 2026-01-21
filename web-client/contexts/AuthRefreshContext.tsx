'use client';

import { createContext, useContext, ReactNode, useEffect, useState, startTransition } from 'react';
import { useAuthStore } from '@/stores/auth';
import cookieUtils from '@/utils/cookieUtils';
import { useAuthQuery } from '@/services/queries/auth';

interface AuthRefreshContextType {
  isRefreshing: boolean;
  showLoadingGate: boolean;
}

const AuthRefreshContext = createContext<AuthRefreshContextType>({
  isRefreshing: false,
  showLoadingGate: false,
});

export const useAuthRefresh = () => useContext(AuthRefreshContext);

export const AuthRefreshProvider = ({ children }: { children: ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);
  const user = useAuthStore(state => state.user);
  const authQuery = useAuthQuery(true);
  const isAuthenticated = cookieUtils.getAuthenticated();

  useEffect(() => {
    startTransition(() => {
      setIsMounted(true);
    });
  }, []);

  const isRefreshing = isMounted && isAuthenticated && !user && !authQuery.isError;
  const showLoadingGate = (!isMounted && isAuthenticated) || isRefreshing;

  return (
    <AuthRefreshContext.Provider value={{ isRefreshing, showLoadingGate }}>
      {children}
    </AuthRefreshContext.Provider>
  );
};
