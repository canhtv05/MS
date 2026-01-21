import HeaderLayout from '@/views/layouts/home/HeaderLayout';
import { ReactNode } from 'react';

interface IRootHomeLayoutProps {
  children: ReactNode;
  settings: ReactNode;
}

const RootHomeLayout = ({ children, settings }: IRootHomeLayoutProps) => {
  const hasSettings = settings !== null && settings !== undefined && settings !== false;
  const wrapperClassName = hasSettings
    ? 'min-h-screen relative overflow-hidden'
    : 'min-h-screen relative';

  return (
    <div className={wrapperClassName}>
      <HeaderLayout />
      {/* Children layer (feed, profile, etc.) */}
      {children}
      {/* Settings layer - overlay on top */}
      {/* {settings} */}
    </div>
  );
};

export default RootHomeLayout;
