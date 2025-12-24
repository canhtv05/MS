'use client';

import { IProfileParams } from '@/app/(home)/[username]/page';
import Image from 'next/image';
import useProfile from './use-profile';
import { use } from 'react';
import { AxiosError } from 'axios';
import { ErrorMessage } from '@/enums/error-message';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { IResponseObject } from '@/types/common';
import { IUserProfileDTO } from '@/types/profile';
import ProfilePageInfo from './ProfilePageInfo';
import ProfilePageHeroSection from './ProfilePageHeroSection';
import ProfilePageTabs from './ProfilePageTabs';
import Zoom from 'react-medium-image-zoom';
import images from '@/public/imgs';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { CameraMinimalistic } from '@solar-icons/react-perf/BoldDuotone';
import { useAuthStore } from '@/stores/auth';

export interface IProfilePageProps {
  isLoading: boolean;
  t?: TFunction<'translation', undefined>;
  data?: IResponseObject<IUserProfileDTO>;
}

const ProfilePage = ({ params }: { params: Promise<IProfileParams> }) => {
  const { username } = use(params);
  const decodedUsername = decodeURIComponent(username);
  const { user } = useAuthStore();
  const { data, isLoading, error } = useProfile({ username: decodedUsername });
  const { t } = useTranslation(['profile', 'layout']);

  if (!decodedUsername.startsWith('@')) {
    return (
      <div className="p-4">
        <h1 className="text-red-500 font-bold">{t('profile_not_found')}</h1>
        <p>
          {t('you_tried_to_access')} {decodedUsername}
        </p>
        <p>{t('expected_username_starting_with')}</p>
        <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded mt-2 text-xs">
          DEBUG INFO: params.username: {decodedUsername}
          decoded: {decodedUsername}
        </pre>
      </div>
    );
  }

  if (error instanceof AxiosError) {
    if (error!.response!.data.code == ErrorMessage.USER_PROFILE_NOT_FOUND) {
      return <div>{t('user_not_found')}</div>;
    }
  }

  return (
    <div className="h-full w-full shadow-[0_0_10px_0_rgba(0,0,0,0.07)] lg:block inline-flex bg-white dark:bg-gray-800 flex-col lg:w-full rounded-lg">
      <div className="relative w-full h-[200px]!">
        <Zoom
          zoomMargin={20}
          zoomImg={{
            src: images.goku.src,
            alt: 'bg',
          }}
        >
          <div className="relative w-full h-[200px]">
            <Image
              src={images.goku.src}
              alt="bg"
              fill
              className="object-cover rounded-t-md"
              loading="eager"
              quality={100}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 60vw"
            />
          </div>
        </Zoom>
        {user?.auth?.username === data?.data?.userId && (
          <Button className="absolute right-2 bottom-2 z-10">
            <CameraMinimalistic />
            {t('layout:header.change_cover')}
          </Button>
        )}
      </div>
      <div className="px-6 pb-6 dark:bg-gray-800 bg-white rounded-b-lg">
        <div className="flex items-end gap-5 -mt-16">
          <ProfilePageHeroSection isLoading={isLoading} t={t} data={data} />
        </div>
        <ProfilePageInfo isLoading={isLoading} t={t} data={data} />
        <ProfilePageTabs />
      </div>
    </div>
  );
};

export default ProfilePage;
