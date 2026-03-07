'use client';

import { IDetailUserProfileDTO } from '@/types/profile';
import TabPost from './TabPost';
import TabIntroduce from './introduce/TabIntroduce';
import { ITabs } from '@/components/TabsNavigation';
import FriendsContainer from './friends/FriendsContainer';
import AlbumsContainer from './albums/AlbumsContainer';

interface ITabsItem {
  tabs: ITabs<string>[];
  activeTab: number;
  data?: IDetailUserProfileDTO;
  isLoading?: boolean;
}

const switchTab = (tab: ITabs<string>['id'], data?: IDetailUserProfileDTO, isLoading?: boolean) => {
  switch (tab) {
    case 'posts':
      return <TabPost data={data} />;
    case 'introduce':
      return <TabIntroduce data={data} isLoading={isLoading} />;
    case 'gallery':
      return <AlbumsContainer showMoreButton={false} />;
    case 'friends':
      return <FriendsContainer showMoreButton={false} />;
    default:
      return <TabPost data={data} />;
  }
};

const TabsItem = ({ tabs, activeTab, data, isLoading }: ITabsItem) => {
  const currentTab = tabs[activeTab];

  return <div className="w-full">{switchTab(currentTab.id, data, isLoading)}</div>;
};

export default TabsItem;
