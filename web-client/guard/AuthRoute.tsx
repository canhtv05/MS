'use client';

import { useState, useEffect } from 'react';
import LoadingPage from '@/views/pages/loading';
import { useAuthQuery } from '@/services/queries/auth';
import { useUserProfileQuery } from '@/services/queries/profile';

interface IAuthRoute {
  children: React.ReactNode;
}

const AuthRoute = ({ children }: IAuthRoute) => {
  const { isLoading: loadingAuth } = useAuthQuery(true);
  const { isLoading: loadingProfile } = useUserProfileQuery(true);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loadingAuth && !loadingProfile && loading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    }
  }, [loadingAuth, loadingProfile, loading]);

  if (loading) {
    return <LoadingPage />;
  }

  return <>{children}</>;
};

export default AuthRoute;
