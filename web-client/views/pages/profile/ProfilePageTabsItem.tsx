'use client';

import { ITabs } from './ProfilePageTabs';
import { IDetailUserProfileDTO } from '@/types/profile';
import ProfilePageTabPost from './ProfilePageTabPost';
import { TFunction } from 'i18next';

interface IProfilePageTabsItem {
  tabs: ITabs[];
  activeTab: number;
  t: TFunction<'profile', undefined>;
  data?: IDetailUserProfileDTO;
}

const switchTab = (tab: ITabs['id'], data?: IDetailUserProfileDTO) => {
  switch (tab) {
    case 'posts':
      return <ProfilePageTabPost data={data} />;
    case 'liked':
      return <ProfilePageTabPost data={data} />;
    case 'saved':
      return [];
    case 'pictures':
      return <ProfilePageTabPost data={data} />;
    case 'friends':
      return [];
    default:
      return <ProfilePageTabPost data={data} />;
  }
};

const ProfilePageTabsItem = ({ tabs, activeTab, t, data }: IProfilePageTabsItem) => {
  const currentTab = tabs[activeTab];

  return <div className="w-full">{switchTab(currentTab.id, data)}</div>;
};

export default ProfilePageTabsItem;
