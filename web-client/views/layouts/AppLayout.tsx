'use client';

import ApiInterceptor from '@/services/interceptor';
import { ThemeProvider } from 'next-themes';
import { ReactNode, startTransition, useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthRefreshProvider, useAuthRefresh } from '@/contexts/AuthRefreshContext';
import { APP_CONFIGS } from '@/configs';
import i18next from '@/locale/i18n';
import LoadingPage from '@/views/pages/loading';

import { ThemeTransitionHandler } from '@/components/ThemeTransitionHandler';
import { useAuthQuery } from '@/services/queries/auth';
import { NavigationProvider } from '@/contexts/NavigationContext';
import { ModalProvider } from '@/contexts/ModalContext';
import TopLoadingBar from '@/components/TopLoadingBar';

interface AppLayoutProps {
  children: ReactNode;
  initialLanguage: 'vi' | 'en';
}

const AuthLoadingGate = ({ children }: { children: ReactNode }) => {
  const { showLoadingGate } = useAuthRefresh();
  const [isMounted, setIsMounted] = useState(true);
  const { user } = useAuthQuery(true);

  useEffect(() => {
    startTransition(() => {
      setIsMounted(false);
    });
  }, [user]);

  if (isMounted || showLoadingGate) {
    return <LoadingPage />;
  }

  return <>{children}</>;
};

const AppLayout = ({ children, initialLanguage }: AppLayoutProps) => {
  if (i18next.language !== initialLanguage) {
    i18next.changeLanguage(initialLanguage);
  }

  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        enableColorScheme
        storageKey="theme"
      >
        <TopLoadingBar height={2} />
        <ThemeTransitionHandler />
        <QueryClientProvider client={APP_CONFIGS.QUERY_CLIENT}>
          <AuthRefreshProvider>
            <AuthLoadingGate>
              <ModalProvider>
                <NavigationProvider>
                  <ApiInterceptor>{children}</ApiInterceptor>
                </NavigationProvider>
              </ModalProvider>
            </AuthLoadingGate>
          </AuthRefreshProvider>
        </QueryClientProvider>
        <Toaster richColors position="bottom-right" theme="light" />
      </ThemeProvider>
    </>
  );
};

export default AppLayout;
