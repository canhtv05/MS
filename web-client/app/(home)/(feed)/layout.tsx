import LayoutContainer from '@/components/LayoutContainer';
import NavigationLayout from '@/views/layouts/navigation/NavigationLayout';
import { ReactNode } from 'react';

interface IFeedLayoutProps {
  children: ReactNode;
}

const FeedLayout = ({ children }: IFeedLayoutProps) => {
  return <LayoutContainer navigation={<NavigationLayout />}>{children}</LayoutContainer>;
};

export default FeedLayout;
