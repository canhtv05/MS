import LayoutContainer from '@/components/LayoutContainer';
import { ReactNode } from 'react';

interface IStandaloneLayoutProps {
  children: ReactNode;
}

const StandaloneLayout = ({ children }: IStandaloneLayoutProps) => {
  return (
    <div className="fixed inset-0 z-60 top-[calc(var(--header-height)+var(--sp-layout))] overflow-auto overscroll-contain no-scrollbar">
      <LayoutContainer className="h-full box-border pt-0! pl-22!">{children}</LayoutContainer>
    </div>
  );
};

export default StandaloneLayout;
