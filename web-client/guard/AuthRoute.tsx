'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';
import cookieUtils from '@/utils/cookieUtils';
import { api } from '@/utils/api';
import { API_ENDPOINTS } from '@/utils/endpoints';
import LoadingPage from '@/views/pages/loading';

interface IAuthRoute {
  children: React.ReactNode;
}

const AuthRoute = ({ children }: IAuthRoute) => {
  const accessToken = cookieUtils.getStorage()?.accessToken;
  const [loading, setLoading] = useState(true);
  const setUser = useAuthStore(state => state.setUser);

  useEffect(() => {
    const fetchUser = async () => {
      if (!accessToken) {
        setUser(undefined);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await api.get(API_ENDPOINTS.AUTH.ME, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUser(res.data.data || null);
      } catch {
        setUser(undefined);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [accessToken, setUser]);

  if (loading) {
    return <LoadingPage />;
  }

  return <>{children}</>;
};

export default AuthRoute;
