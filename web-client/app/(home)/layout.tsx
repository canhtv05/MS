import HeaderLayout from '@/views/layouts/home/HeaderLayout';
import NavigationLayout from '@/views/layouts/navigation/NavigationLayout';
import SidebarLayout from '@/views/layouts/sidebar/SidebarLayout';
import { ReactNode } from 'react';

interface IHomeLayoutProps {
  children: ReactNode;
}

const HomeLayout = ({ children }: IHomeLayoutProps) => {
  return (
    <div className="h-screen overflow-hidden">
      <HeaderLayout />
      <div className="flex bg-[#F9FBFC] lg:px-6 lg:pt-22 px-3 pt-19 dark:bg-gray-900 h-full">
        <div className="lg:block fixed md:static md:translate-x-0 -translate-x-1/2 md:left-0 left-1/2 md:bottom-auto bottom-0 lg:w-auto w-auto z-40">
          <NavigationLayout />
        </div>
        <div className="w-full flex-1 xl:px-7 lg:px-6 pr-1 md:pl-4 px-2 h-full lg:pb-8 pb-4">
          {children}
        </div>
        <SidebarLayout />
      </div>
    </div>
  );
};

export default HomeLayout;
