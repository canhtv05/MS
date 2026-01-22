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
    <div className="fixed inset-0 z-60 md:bg-transparent bg-black/50 overflow-hidden">
      <div className="md:hidden block fixed left-0 top-0 z-60! h-[60px] w-full bg-red-500">ok</div>
      <div className="fixed top-15 left-0 right-0 bottom-0 h-5 z-40 custom-bg-2 w-full"></div>
      <div className="absolute top-15 inset-0 custom-bg-2">
        <div className="fixed md:block hidden top-4 md:top-20 left-4 md:left-6 z-20">
          <IconButton onClick={handleClose} variant="outline" className="rounded-full">
            <XIcon />
          </IconButton>
        </div>
        <div className="h-full p-5 pl-24 w-full overflow-y-auto overflow-x-hidden overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
};

export default StandaloneLayout;
