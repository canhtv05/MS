import HomeHeaderLayout from '@/views/layouts/home/HomeHeaderLayout';
import { NextPage } from 'next';
import { ReactNode } from 'react';

interface IHomeLayoutProps {
  children: ReactNode;
}

const HomeLayout: NextPage<IHomeLayoutProps> = ({ children }) => {
  return (
    <div>
      <HomeHeaderLayout />
      {children}
    </div>
  );
};

export default HomeLayout;
