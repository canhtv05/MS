'use client';

import { useEffect, ReactNode, useState } from 'react';
import LoadingPage from '@/views/pages/loading';
import { useAuthQuery } from '@/services/queries/auth';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import { useAuthRefresh } from '@/guard/AuthRefreshContext';

interface IAuthRoute {
  children: ReactNode;
}

const AuthRoute = ({ children }: IAuthRoute) => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  const { isRefreshing } = useAuthRefresh();
  const { isLoading: isAuthenticating, user: userData } = useAuthQuery(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticating && !isRefreshing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [isAuthenticating, isRefreshing]);

  useEffect(() => {
    if (!loading && !userData && !isRefreshing) {
      setUser(undefined);
    }
  }, [queryClient, userData, loading, setUser, isRefreshing]);

  if (loading) {
    return <LoadingPage />;
  }

  return <>{children}</>;
};

export default AuthRoute;
