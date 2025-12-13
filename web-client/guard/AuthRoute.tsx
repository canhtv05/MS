'use client';

import { useState, useEffect, ReactNode } from 'react';
import LoadingPage from '@/views/pages/loading';
import { useAuthQuery } from '@/services/queries/auth';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import cookieUtils from '@/utils/cookieUtils';

interface IAuthRoute {
  children: ReactNode;
}

const AuthRoute = ({ children }: IAuthRoute) => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  const { isLoading: isAuthenticating, user: userData } = useAuthQuery(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticating) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    }
  }, [isAuthenticating]);

  useEffect(() => {
    if (!loading && !userData) {
      setUser(undefined);
      queryClient.clear();
      cookieUtils.deleteStorage();
    }
  }, [queryClient, userData, loading, setUser]);

  if (loading) {
    return <LoadingPage />;
  }

  return <>{children}</>;
};

export default AuthRoute;
