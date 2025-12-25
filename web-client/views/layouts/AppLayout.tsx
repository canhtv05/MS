'use client';

import ApiInterceptor from '@/services/interceptor';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import RouteGuard from '@/guard/RouteGuard';
import { AuthRefreshProvider } from '@/guard/AuthRefreshContext';
import { APP_CONFIGS } from '@/configs';
import '@/locale/i18n';

import { ThemeTransitionHandler } from '@/components/ThemeTransitionHandler';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="dark" enableColorScheme>
        <ThemeTransitionHandler />
        <QueryClientProvider client={APP_CONFIGS.QUERY_CLIENT}>
          <AuthRefreshProvider>
            <ApiInterceptor>
              <RouteGuard>{children}</RouteGuard>
            </ApiInterceptor>
          </AuthRefreshProvider>
        </QueryClientProvider>
        <Toaster richColors position="bottom-right" theme="light" />
      </ThemeProvider>
    </>
  );
};

export default AppLayout;
