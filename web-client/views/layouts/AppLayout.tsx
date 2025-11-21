'use client';

import ApiInterceptor from '@/services/interceptor';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '@/locale/i18n';

interface AppLayoutProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="dark" enableColorScheme>
        <QueryClientProvider client={queryClient}>
          <ApiInterceptor>{children}</ApiInterceptor>
        </QueryClientProvider>
        <Toaster richColors position="bottom-right" theme="light" />
      </ThemeProvider>
    </>
  );
};

export default AppLayout;
