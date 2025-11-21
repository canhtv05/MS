'use client';
import { useAuthQuery } from '@/services/queries/auth';
import LoadingPage from '@/views/pages/loading';

interface IAuthRoute {
  children: React.ReactNode;
}

const AuthRoute = ({ children }: IAuthRoute) => {
  const { userProfile, isLoading } = useAuthQuery();

  if (isLoading || !userProfile) {
    return <LoadingPage />;
  }

  return <>{children}</>;
};

export default AuthRoute;
