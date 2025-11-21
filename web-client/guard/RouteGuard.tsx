'use client';

import { useAuthQuery } from '@/services/queries/auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface IRouteGuard {
  children: React.ReactNode;
}

const RouteGuard = ({ children }: IRouteGuard) => {
  const { userProfile } = useAuthQuery();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/sign-up' || pathname === '/sign-in') {
      if (userProfile) {
        router.push('/home');
      }
    }
  }, [pathname, router, userProfile]);

  return <>{children}</>;
};

export default RouteGuard;
