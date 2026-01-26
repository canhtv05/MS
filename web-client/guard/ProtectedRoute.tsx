'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import cookieUtils from '@/utils/cookieUtils';
import LoadingPage from '@/views/pages/loading';
import { useAuthQuery } from '@/services/queries/auth';
import { useAuthRefresh } from '@/contexts/AuthRefreshContext';

export type RouteAccessLevel = 'public' | 'authenticated' | 'admin';

interface IProtectedRoute {
  children: ReactNode;
  accessLevel?: RouteAccessLevel;
  redirectTo?: string;
  showLoading?: boolean;
}

const ProtectedRoute = ({
  children,
  accessLevel = 'authenticated',
  redirectTo,
  showLoading = true,
}: IProtectedRoute) => {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const { isRefreshing } = useAuthRefresh();
  const { isLoading: isAuthenticating } = useAuthQuery(accessLevel !== 'public');

  const isAuthenticated = cookieUtils.getAuthenticated();
  const isLoading = isAuthenticating || isRefreshing;

  useEffect(() => {
    if (!isLoading && accessLevel === 'authenticated') {
      if (!isAuthenticated || !user) {
        router.replace(redirectTo || '/sign-in');
      }
    }
  }, [isLoading, isAuthenticated, user, accessLevel, router, redirectTo]);

  useEffect(() => {
    if (!isLoading && accessLevel === 'admin') {
      if (!isAuthenticated || !user) {
        router.replace(redirectTo || '/sign-in');
        return;
      }

      const hasAdminRole = user?.auth?.roles?.some(
        role => role === 'ROLE_ADMIN' || role === 'ADMIN' || role === 'ROLE_SUPER_ADMIN',
      );

      if (!hasAdminRole) {
        router.replace(redirectTo || '/home');
      }
    }
  }, [isLoading, isAuthenticated, user, accessLevel, redirectTo, router]);

  if (accessLevel === 'public') {
    return <>{children}</>;
  }

  if (isLoading) {
    return showLoading ? <LoadingPage /> : null;
  }

  if (accessLevel === 'authenticated' && (!isAuthenticated || !user)) {
    return null;
  }

  if (accessLevel === 'admin') {
    if (!isAuthenticated || !user) {
      return null;
    }

    const hasAdminRole = user?.auth?.roles?.some(
      role => role === 'ROLE_ADMIN' || role === 'ADMIN' || role === 'ROLE_SUPER_ADMIN',
    );

    if (!hasAdminRole) {
      return null;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
