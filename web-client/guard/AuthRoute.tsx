'use client';

import { useState, useEffect } from 'react';
import LoadingPage from '@/views/pages/loading';
import { useAuthQuery } from '@/services/queries/auth';
import { useUserProfileQuery } from '@/services/queries/profile';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import cookieUtils from '@/utils/cookieUtils';

interface IAuthRoute {
  children: React.ReactNode;
}

const AuthRoute = ({ children }: IAuthRoute) => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore(state => state.setUser);
  const { isLoading: loadingAuth, user: userData } = useAuthQuery(true);
  const { isLoading: loadingProfile, userProfile } = useUserProfileQuery(true);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loadingAuth && !loadingProfile && loading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    }
  }, [loadingAuth, loadingProfile, loading]);

  useEffect(() => {
    if ((!userData || !userProfile) && !loading) {
      setUser(undefined);
      queryClient.clear();
      cookieUtils.deleteStorage();
    }
  }, [queryClient, userData, userProfile, loading, setUser]);

  if (loading) {
    return <LoadingPage />;
  }

  return <>{children}</>;
};

export default AuthRoute;
