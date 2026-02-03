'use client';

import { IDetailUserProfileDTO } from '@/types/profile';
import Wrapper from '@/components/ui/wrapper';
import Show from '@/components/Show';
import { useAuthStore } from '@/stores/auth';
import { PrivacyLevel } from '@/enums/common';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'next/navigation';
import NavIntroduce from './NavIntroduce';
import { Separator } from '@/components/ui/separator';
import MainIntroduce from './MainIntroduce';
import { Skeleton } from '@/components/ui/skeleton';
import IntroduceSkeleton from './IntroduceSkeleton';

interface ITabIntroduce {
  data?: IDetailUserProfileDTO;
  isLoading?: boolean;
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

const TabIntroduce = ({ data, isLoading }: ITabIntroduce) => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const subtabParam = searchParams.get('subtab');

  // Get activeTab from URL params, default to 'basic_info' if not found or invalid
  const activeTab: TNavIntroduceItem =
    subtabParam && subtabParam in NAV_INTRODUCE_MENU
      ? (subtabParam as TNavIntroduceItem)
      : 'basic_info';

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <div className="flex flex-col gap-(--sp-layout) flex-1 w-full lg:w-auto min-w-0">
        <Show
          when={
            isLoading ||
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
              {isLoading ? (
                <>
                  <div className="min-w-[250px] shrink-0">
                    <div className="flex flex-col gap-2 items-start justify-start">
                      {Object.keys(NAV_INTRODUCE_MENU).map(key => (
                        <div key={key} className="w-full p-2">
                          <Skeleton className="h-8 w-full rounded-lg" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator orientation="vertical" className="w-px self-stretch" />
                  <div className="flex-1 w-full">
                    <IntroduceSkeleton activeTab={activeTab} />
                  </div>
                </>
              ) : (
                <>
                  <div className="min-w-[250px] shrink-0">
                    <NavIntroduce menu={NAV_INTRODUCE_MENU} activeTab={activeTab} />
                  </div>
                  <Separator orientation="vertical" className="w-px self-stretch" />
                  <div className="flex-1 w-full">
                    <MainIntroduce
                      menu={NAV_INTRODUCE_MENU}
                      data={data}
                      isOwner={data?.userId === user?.auth?.username}
                    />
                  </div>
                </>
              )}
            </div>
          </Wrapper>
        </Show>
      </div>
    </div>
  );
};

export default TabIntroduce;
