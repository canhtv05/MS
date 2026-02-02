'use client';

import { IDetailUserProfileDTO } from '@/types/profile';
import Wrapper from '@/components/ui/wrapper';
import Show from '@/components/Show';
import { useAuthStore } from '@/stores/auth';
import { PrivacyLevel } from '@/enums/common';
import { useTranslation } from 'react-i18next';
import NavIntroduce from './NavIntroduce';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import MainIntroduce from './MainIntroduce';

interface ITabIntroduce {
  data?: IDetailUserProfileDTO;
}

export const NAV_INTRODUCE_MENU = {
  basic_info: ['dob', 'gender', 'relationship_status', 'hometown', 'city'],
  work_and_education: ['school', 'job_title', 'company'],
  interests: ['interests'],
  contacts_and_social: [
    'phone_number',
    'website_url',
    'facebook_url',
    'github_url',
    'linkedin_url',
    'instagram_url',
    'tiktok_url',
    'x_url',
  ],
} as const;

export type TNavIntroduceItem = keyof typeof NAV_INTRODUCE_MENU;
export type TIntroduceField = (typeof NAV_INTRODUCE_MENU)[TNavIntroduceItem][number];

const TabIntroduce = ({ data }: ITabIntroduce) => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TNavIntroduceItem>('basic_info');

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <div className="flex flex-col gap-(--sp-layout) flex-1 w-full lg:w-auto min-w-0">
        <Show
          when={
            data?.privacy?.introduceVisibility !== PrivacyLevel.PRIVACY_LEVEL_PRIVATE ||
            data?.userId === user?.auth?.username
          }
          fallback={
            <Wrapper>
              <p className="text-sm text-center">{t('no_data')}</p>
            </Wrapper>
          }
        >
          <Wrapper title={t('profile:introduce')}>
            <div className="flex gap-(--sp-layout) items-stretch">
              <div className="min-w-[250px] shrink-0">
                <NavIntroduce
                  menu={NAV_INTRODUCE_MENU}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </div>
              <Separator orientation="vertical" className="w-px self-stretch" />
              <div className="flex-1 w-full">
                <MainIntroduce
                  menu={NAV_INTRODUCE_MENU}
                  activeTab={activeTab}
                  data={data}
                  isOwner={data?.userId === user?.auth?.username}
                />
              </div>
            </div>
          </Wrapper>
        </Show>
      </div>
    </div>
  );
};

export default TabIntroduce;
