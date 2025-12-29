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
      <div className="flex relative items-start justify-center bg-[#F9FBFC] pt-16 px-[9px] dark:bg-gray-900 min-h-screen w-full">
        <div className="lg:block fixed md:sticky top-18 md:translate-x-0 -translate-x-1/2 md:left-0 left-1/2 md:bottom-auto bottom-0 lg:w-auto w-auto z-40">
          <NavigationLayout />
        </div>
        <div className="fixed top-[60px] left-0 right-0 bottom-0 h-3 z-40 bg-[#F9FBFC] dark:bg-gray-900 w-full"></div>
        {/* <div className="fixed top-[60px] left-0 right-0 bottom-0 h-3 z-40 bg-[#F9FBFC] dark:bg-gray-900 w-full"></div> */}
        <div className="relative lg:mt-2 w-full flex-1 md:pb-4 pb-20 px-3 lg:pb-8">{children}</div>
        <div className="sticky top-18 hidden lg:block xl:w-72 lg:w-64 self-start">
          <SidebarLayout />
        </div>
      </div>
    </div>
  );
};

export default HomeLayout;
