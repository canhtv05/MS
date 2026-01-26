import HeaderLayout from '@/views/layouts/home/HeaderLayout';
import { ReactNode } from 'react';

interface IRootHomeLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

const RootHomeLayout = ({ children, modal }: IRootHomeLayoutProps) => {
  return (
    <div className="min-h-screen relative">
      <HeaderLayout />
      <div className="relative z-0">{children}</div>
      {modal}
    </div>
  );
};

export default RootHomeLayout;
