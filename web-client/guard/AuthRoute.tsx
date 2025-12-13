'use client';

import { useState, useEffect } from 'react';
import LoadingPage from '@/views/pages/loading';
import { useAuthQuery } from '@/services/queries/auth';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import cookieUtils from '@/utils/cookieUtils';

interface IAuthRoute {
  children: React.ReactNode;
}

const AuthRoute = ({ children }: IAuthRoute) => {
  const queryClient = useQueryClient();
  const { setUser, user } = useAuthStore();
  const { isLoading: loadingAuth, user: userData } = useAuthQuery(true);
  // const { meQuery } = useMyProfileQuery(true);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loadingAuth && !user && loading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    }
  }, [loadingAuth, loading, user]);

  useEffect(() => {
    if ((!userData || !user) && !loading) {
      setUser(undefined);
      queryClient.clear();
      cookieUtils.deleteStorage();
    }
  }, [queryClient, userData, loading, setUser, user]);

  if (loading) {
    return <LoadingPage />;
  }

  return <>{children}</>;
};

export default AuthRoute;
