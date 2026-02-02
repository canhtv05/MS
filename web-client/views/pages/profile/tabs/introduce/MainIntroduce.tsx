'use client';

import { TNavIntroduceItem } from './TabIntroduce';
import { IDetailUserProfileDTO } from '@/types/profile';
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { WorkEducationTab } from './tabs/WorkEducationTab';
import { InterestsTab } from './tabs/InterestsTab';
import { ContactsSocialTab } from './tabs/ContactsSocialTab';

interface IMainIntroduceProps {
  activeTab: TNavIntroduceItem;
  menu: Record<TNavIntroduceItem, readonly string[]>;
  data?: IDetailUserProfileDTO;
  isOwner?: boolean;
}

const MainIntroduce = ({ activeTab, data, isOwner = false }: IMainIntroduceProps) => {
  const renderTab = () => {
    switch (activeTab) {
      case 'basic_info':
        return <BasicInfoTab data={data} isOwner={isOwner} />;
      case 'work_and_education':
        return <WorkEducationTab data={data} isOwner={isOwner} />;
      case 'interests':
        return <InterestsTab data={data} isOwner={isOwner} />;
      case 'contacts_and_social':
        return <ContactsSocialTab data={data} isOwner={isOwner} />;
      default:
        return null;
    }
  };

  return <div className="w-full">{renderTab()}</div>;
};

export default MainIntroduce;
