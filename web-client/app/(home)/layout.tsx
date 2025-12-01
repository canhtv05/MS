import HeaderLayout from '@/views/layouts/home/HeaderLayout';
import NavigationLayout from '@/views/layouts/navigation/NavigationLayout';
import { ReactNode } from 'react';

interface IHomeLayoutProps {
  children: ReactNode;
}

const HomeLayout = ({ children }: IHomeLayoutProps) => {
  return (
    <div className="h-screen">
      <HeaderLayout />
      <div className="bg-gray-200 px-8 dark:bg-gray-900 h-full flex pt-16">
        <NavigationLayout />
        <div className="w-full flex-1">{children}</div>
      </div>
    </div>
  );
};

export default HomeLayout;
