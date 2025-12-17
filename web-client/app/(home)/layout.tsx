import HeaderLayout from '@/views/layouts/home/HeaderLayout';
import NavigationLayout from '@/views/layouts/navigation/NavigationLayout';
import SidebarLayout from '@/views/layouts/sidebar/SidebarLayout';
import { ReactNode } from 'react';

interface IHomeLayoutProps {
  children: ReactNode;
}

const HomeLayout = ({ children }: IHomeLayoutProps) => {
  return (
    <div className="min-h-screen">
      <HeaderLayout />
      <div className="flex relative items-start justify-center bg-[#F9FBFC] lg:px-6 lg:pt-22 pt-19 px-3 dark:bg-gray-900 min-h-screen w-full">
        <div className="lg:block fixed md:sticky lg:top-22 md:top-19 top-20 md:translate-x-0 -translate-x-1/2 md:left-0 left-1/2 md:bottom-auto bottom-0 lg:w-auto w-auto z-40">
          <NavigationLayout />
        </div>
        <div className="fixed top-[60px] left-0 right-0 bottom-0 lg:h-7 h-4 z-50 bg-[#F9FBFC] dark:bg-gray-900 w-full"></div>
        <div className="relative lg:mt-0 w-full flex-1 lg:px-7 pr-0 md:pb-4 pb-20 md:pl-4 pl-1 px-2 lg:pb-8">
          {children}
        </div>
        <div className="sticky top-22 hidden lg:block xl:w-72 lg:w-64 self-start">
          <SidebarLayout />
        </div>
      </div>
    </div>
  );
};

export default HomeLayout;
