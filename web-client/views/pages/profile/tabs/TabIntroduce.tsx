'use client';

import { IDetailUserProfileDTO } from '@/types/profile';
import Wrapper from '@/components/ui/wrapper';
import Show from '@/components/Show';
import { useAuthStore } from '@/stores/auth';
import { PrivacyLevel } from '@/enums/common';
import { useTranslation } from 'react-i18next';

interface ITabIntroduce {
  data?: IDetailUserProfileDTO;
}

const TabIntroduce = ({ data }: ITabIntroduce) => {
  const { user } = useAuthStore();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <div className="flex flex-col gap-(--sp-layout) flex-1 w-full lg:w-auto min-w-0">
        <Show
          when={
            data?.privacy?.postsVisibility !== PrivacyLevel.PRIVACY_LEVEL_PRIVATE ||
            data?.userId === user?.auth?.username
          }
          fallback={
            <Wrapper>
              <p className="text-sm text-center">{t('no_data')}</p>
            </Wrapper>
          }
        >
          ok
        </Show>
      </div>
    </div>
  );
};

export default TabIntroduce;
