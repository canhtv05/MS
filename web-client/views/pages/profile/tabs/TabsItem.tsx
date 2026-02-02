'use client';

import { ITabs } from './Tabs';
import { IDetailUserProfileDTO } from '@/types/profile';
import TabPost from './TabPost';
import TabIntroduce from './introduce/TabIntroduce';

interface ITabsItem {
  tabs: ITabs[];
  activeTab: number;
  data?: IDetailUserProfileDTO;
}

const switchTab = (tab: ITabs['id'], data?: IDetailUserProfileDTO) => {
  switch (tab) {
    case 'posts':
      return <TabPost data={data} />;
    case 'introduce':
      return <TabIntroduce data={data} />;
    case 'gallery':
      return <TabPost data={data} />;
    case 'friends':
      return <TabPost data={data} />;
    default:
      return <TabPost data={data} />;
  }
};

const TabsItem = ({ tabs, activeTab, data }: ITabsItem) => {
  const currentTab = tabs[activeTab];

  return <div className="w-full">{switchTab(currentTab.id, data)}</div>;
};

export default TabsItem;
