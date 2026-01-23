'use client';

import LayoutContainer from '@/components/LayoutContainer';
import { ReactNode } from 'react';

interface IStandaloneLayoutProps {
  children: ReactNode;
}

const StandaloneLayout = ({ children }: IStandaloneLayoutProps) => {
  return (
    <div className="fixed inset-x-0 top-0 bottom-0 z-40 backdrop-blur-sm overflow-auto overscroll-contain no-scrollbar">
      <LayoutContainer className="h-full box-border">{children}</LayoutContainer>
    </div>
  );
};

export default StandaloneLayout;
