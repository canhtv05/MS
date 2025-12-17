'use client';

import { useAuthStore } from '@/stores/auth';
import cookieUtils from '@/utils/cookieUtils';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface IRouteGuard {
  children: React.ReactNode;
}

const RouteGuard = ({ children }: IRouteGuard) => {
  const user = useAuthStore(state => state.user);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/sign-up' || pathname === '/sign-in') {
      const token = cookieUtils.getStorage()?.accessToken;
      if (user && token) {
        router.push('/home');
      }
    }
  }, [pathname, router, user]);

  return <>{children}</>;
};

export default RouteGuard;
