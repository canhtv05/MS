'use client';

import { ITabs } from './Tabs';
import { IDetailUserProfileDTO } from '@/types/profile';
import TabPost from './TabPost';
import { TFunction } from 'i18next';

interface ITabsItem {
  tabs: ITabs[];
  activeTab: number;
  t: TFunction<'profile', undefined>;
  data?: IDetailUserProfileDTO;
}

const switchTab = (tab: ITabs['id'], data?: IDetailUserProfileDTO) => {
  switch (tab) {
    case 'postsVisibility':
      return <TabPost data={data} />;
    case 'introduceVisibility':
      return <TabPost data={data} />;
    case 'galleryVisibility':
      return [];
    case 'friendsVisibility':
      return <TabPost data={data} />;
    default:
      return <TabPost data={data} />;
  }
};

const TabsItem = ({ tabs, activeTab, t, data }: ITabsItem) => {
  const currentTab = tabs[activeTab];

  return <div className="w-full">{switchTab(currentTab.id, data)}</div>;
};

export default TabsItem;
