import HeaderLayout from '@/views/layouts/home/HeaderLayout';
import { ReactNode } from 'react';

interface IRootHomeLayoutProps {
  children: ReactNode;
  parallel: ReactNode;
}

const RootHomeLayout = ({ children, parallel }: IRootHomeLayoutProps) => {
  const hasParallel = parallel !== null && parallel !== undefined && parallel !== false;
  const wrapperClassName = hasParallel
    ? 'min-h-screen relative overflow-hidden'
    : 'min-h-screen relative';

  return (
    <div className={wrapperClassName}>
      <HeaderLayout />
      <div className="relative z-0">{children}</div>
      {parallel}
    </div>
  );
};

export default RootHomeLayout;
