import HomeHeaderLayout from '@/views/layouts/home/HomeHeaderLayout';
import { ReactNode } from 'react';

interface IHomeLayoutProps {
  children: ReactNode;
}

const HomeLayout = ({ children }: IHomeLayoutProps) => {
  return (
    <div className="h-screen">
      <HomeHeaderLayout />
      <div className="bg-gray-200 dark:bg-gray-900 h-full">{children}</div>
    </div>
  );
};

export default HomeLayout;
