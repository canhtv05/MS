'use client';

import { IconButton } from '@/components/animate-ui/components/buttons/icon';
import { XIcon } from '@/components/animate-ui/icons';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

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
    <div className="fixed inset-x-0 top-(--header-height) bottom-0 z-40 custom-bg-2 overflow-hidden">
      <div className="absolute inset-0">
        <div className="fixed md:block hidden top-[calc(var(--header-height)+1rem)] left-4 md:left-6 z-20">
          <IconButton onClick={handleClose} variant="outline" className="rounded-full">
            <XIcon />
          </IconButton>
        </div>
        <div className="h-full [&_main]:pl-0! p-5 md:pl-24 w-full overflow-y-auto overflow-x-hidden overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
};

export default StandaloneLayout;
