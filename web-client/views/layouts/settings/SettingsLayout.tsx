'use client';

import { IconButton } from '@/components/animate-ui/components/buttons/icon';
import { useRouter, usePathname } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { ArrowLeft } from '@solar-icons/react-perf/BoldDuotone';
import { startTransition } from 'react';

interface ISettingsLayoutProps {
  children: React.ReactNode;
}

const SettingsLayout = ({ children }: ISettingsLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/settings') return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [pathname]);

  const handleClose = useCallback(() => {
    startTransition(() => {
      router.back();
    });
  }, [router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  if (pathname !== '/settings') return null;

  return (
    <div className="fixed inset-0 z-80 pointer-events-none">
      <div
        className="absolute inset-0 top-(--header-height) pointer-events-auto custom-bg-2 z-10 backdrop-blur-md bg-background/80"
        onClick={handleClose}
      />
      <div className="absolute inset-0 top-(--header-height) pointer-events-none z-20 custom-bg-2">
        <div className="fixed lg:block hidden top-[76px] left-4 md:left-7 z-80 pointer-events-auto">
          <IconButton
            onClick={handleClose}
            variant="outline"
            className="rounded-full hover:translate-x-[-2px]"
          >
            <ArrowLeft />
          </IconButton>
        </div>
        <div className="h-full [&_main]:pl-0! p-5 lg:pl-24 w-full overflow-y-auto overflow-x-hidden overscroll-contain pointer-events-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
