import LayoutContainer from '@/views/layouts/LayoutContainer';
import NavigationLayout from '@/views/layouts/navigation/NavigationLayout';
import { NavigationProvider } from '@/contexts/navigation-context';
import { ReactNode } from 'react';

interface IFeedLayoutProps {
  children: ReactNode;
}

const FeedLayout = ({ children }: IFeedLayoutProps) => {
  return (
    <NavigationProvider>
      <LayoutContainer navigation={<NavigationLayout />}>{children}</LayoutContainer>
    </NavigationProvider>
  );
};

export default FeedLayout;
