'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { TNavIntroduceItem, NAV_INTRODUCE_MENU } from './TabIntroduce';
import { IDetailUserProfileDTO } from '@/types/profile';
import IntroduceSkeleton from './IntroduceSkeleton';

const BasicInfoTab = React.lazy(() =>
  import('./tabs/BasicInfoTab').then(module => ({ default: module.BasicInfoTab })),
);
const WorkEducationTab = React.lazy(() =>
  import('./tabs/WorkEducationTab').then(module => ({ default: module.WorkEducationTab })),
);
const InterestsTab = React.lazy(() =>
  import('./tabs/InterestsTab').then(module => ({ default: module.InterestsTab })),
);
const ContactsSocialTab = React.lazy(() =>
  import('./tabs/ContactsSocialTab').then(module => ({ default: module.ContactsSocialTab })),
);

interface IMainIntroduceProps {
  menu: Record<TNavIntroduceItem, readonly string[]>;
  data?: IDetailUserProfileDTO;
  isOwner?: boolean;
}

const MainIntroduce = ({ data, isOwner = false }: IMainIntroduceProps) => {
  const searchParams = useSearchParams();
  const subtabParam = searchParams.get('subtab');

  const activeTab: TNavIntroduceItem =
    subtabParam && subtabParam in NAV_INTRODUCE_MENU
      ? (subtabParam as TNavIntroduceItem)
      : 'basic_info';

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

  return (
    <div className="w-full min-w-0 overflow-x-hidden">
      <Suspense fallback={<IntroduceSkeleton activeTab={activeTab} />}>{renderTab()}</Suspense>
    </div>
  );
};

export default MainIntroduce;
