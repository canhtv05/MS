import HeaderLayout from '@/views/layouts/home/HeaderLayout';
import NavigationLayout from '@/views/layouts/navigation/NavigationLayout';
import SidebarLayout from '@/views/layouts/sidebar/SidebarLayout';
import { ReactNode } from 'react';

interface IHomeLayoutProps {
  children: ReactNode;
}

const HomeLayout = ({ children }: IHomeLayoutProps) => {
  return (
    <div className="h-screen">
      <HeaderLayout />
      <div className="bg-[#F9FBFC] lg:px-6 lg:pt-21 px-3 pt-19 dark:bg-gray-900 h-full flex">
        <NavigationLayout />
        <div className="w-full flex-1">{children}</div>
        {/* <SidebarLayout /> */}
      </div>
    </div>
  );
};

export default HomeLayout;
