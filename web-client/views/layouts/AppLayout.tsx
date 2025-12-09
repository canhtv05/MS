'use client';

import ApiInterceptor from '@/services/interceptor';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import RouteGuard from '@/guard/RouteGuard';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '@/locale/i18n';
import { APP_CONFIGS } from '@/configs';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="dark" enableColorScheme>
        <QueryClientProvider client={APP_CONFIGS.QUERY_CLIENT}>
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
