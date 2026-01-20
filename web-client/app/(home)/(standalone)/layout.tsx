import LayoutContainer from '@/components/LayoutContainer';
import { ReactNode } from 'react';

interface IStandaloneLayoutProps {
  children: ReactNode;
}

const StandaloneLayout = ({ children }: IStandaloneLayoutProps) => {
  return <LayoutContainer>{children}</LayoutContainer>;
};

export default StandaloneLayout;
