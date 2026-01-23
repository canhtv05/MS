'use client';

import { IconButton } from '@/components/animate-ui/components/buttons/icon';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { ArrowLeft } from '@solar-icons/react-perf/BoldDuotone';

interface IStandaloneLayoutProps {
  children: ReactNode;
}

const StandaloneLayout = ({ children }: IStandaloneLayoutProps) => {
  const router = useRouter();

  useEffect(() => {
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
  }, []);

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="fixed inset-0 z-120 pointer-events-none">
      <div className="absolute inset-0 top-(--header-height) pointer-events-auto custom-bg-2 z-10 backdrop-blur-md bg-background/80" />
      <div className="absolute inset-0 top-(--header-height) pointer-events-none z-20">
        <div className="fixed md:block hidden top-[76px] left-4 md:left-6 z-120 pointer-events-auto">
          <IconButton
            onClick={handleClose}
            variant="outline"
            className="rounded-full hover:translate-x-[-2px]"
          >
            <ArrowLeft />
          </IconButton>
        </div>
        <div className="h-full [&_main]:pl-0! p-5 md:pl-24 w-full overflow-y-auto overflow-x-hidden overscroll-contain pointer-events-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default StandaloneLayout;
