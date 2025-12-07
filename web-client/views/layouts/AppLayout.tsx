'use client';

import ApiInterceptor from '@/services/interceptor';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import RouteGuard from '@/guard/RouteGuard';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '@/locale/i18n';
import { AxiosError } from 'axios';
import cookieUtils from '@/utils/cookieUtils';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError(error) {
        if (error instanceof AxiosError) {
          if (error?.response?.status === 401) {
            cookieUtils.deleteStorage();
            queryClient.setQueryData(['auth', 'me'], undefined);
            queryClient.setQueryData(['profile', 'me'], undefined);
          }
        }
      },
    }),
  });

  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="dark" enableColorScheme>
        <QueryClientProvider client={queryClient}>
          <ApiInterceptor>
            <RouteGuard>{children}</RouteGuard>
          </ApiInterceptor>
        </QueryClientProvider>
        <Toaster richColors position="bottom-right" theme="light" />
      </ThemeProvider>
    </>
  );
};

export default AppLayout;
