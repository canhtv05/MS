import HomeHeaderLayout from '@/views/layouts/home/HomeHeaderLayout';
import { ReactNode } from 'react';

interface IHomeLayoutProps {
  children: ReactNode;
}

const HomeLayout = ({ children }: IHomeLayoutProps) => {
  return (
    <div>
      <HomeHeaderLayout />
      {children}
    </div>
  );
};

export default HomeLayout;
