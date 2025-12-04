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
      <div className="flex bg-[#F9FBFC] lg:px-6 lg:pt-22 px-3 pt-19 dark:bg-gray-900 h-full">
        <div className="lg:block fixed md:bottom-auto bottom-0 lg:w-auto w-full">
          <NavigationLayout />
        </div>
        <div className="w-full flex-1">{children}</div>
        {/* <SidebarLayout /> */}
      </div>
    </div>
  );
};

export default HomeLayout;
