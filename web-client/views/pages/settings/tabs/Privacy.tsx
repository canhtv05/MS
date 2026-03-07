'use client';

import { useTranslation } from 'react-i18next';
import { PrivacyLevel } from '@/enums/common';
import { usePrivacyQuery } from '@/services/queries/profile';
import { IUserProfilePrivacyDTO } from '@/types/profile';
import { useProfileMutation } from '@/services/mutations/profile';
import Show from '@/components/Show';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import RenderSelect from '../../profile/components/RenderSelect';

const Privacy = () => {
  const { t } = useTranslation('settings');
  const { data: privacyData, isLoading } = usePrivacyQuery();
  const { updatePrivacyMutation } = useProfileMutation();
  const [privacyDataState, setPrivacyDataState] = useState<
    Omit<IUserProfilePrivacyDTO, 'id'> | null | undefined
  >(privacyData ?? null);

  const handleSetPrivacy = async (
    key: keyof Omit<IUserProfilePrivacyDTO, 'id'>,
    value: PrivacyLevel,
  ) => {
    const base: Omit<IUserProfilePrivacyDTO, 'id'> =
      privacyDataState ??
      (privacyData
        ? {
            profileVisibility: privacyData.profileVisibility,
            friendsVisibility: privacyData.friendsVisibility,
            postsVisibility: privacyData.postsVisibility,
            introduceVisibility: privacyData.introduceVisibility,
            galleryVisibility: privacyData.galleryVisibility,
          }
        : {
            profileVisibility: PrivacyLevel.PRIVACY_LEVEL_PUBLIC,
            friendsVisibility: PrivacyLevel.PRIVACY_LEVEL_PUBLIC,
            postsVisibility: PrivacyLevel.PRIVACY_LEVEL_PUBLIC,
            introduceVisibility: PrivacyLevel.PRIVACY_LEVEL_PUBLIC,
            galleryVisibility: PrivacyLevel.PRIVACY_LEVEL_PUBLIC,
          });
    if (base[key] === value) return;
    const next = { ...base, [key]: value };
    updatePrivacyMutation.mutate(
      {
        profileVisibility: next.profileVisibility,
        friendsVisibility: next.friendsVisibility,
        postsVisibility: next.postsVisibility,
        introduceVisibility: next.introduceVisibility,
        galleryVisibility: next.galleryVisibility,
      },
      {
        onSuccess: () => {
          setPrivacyDataState(next);
        },
      },
    );
  };

  const privacySettings = [
    {
      id: 'profile',
      titleKey: 'privacy.profile_visibility.title',
      descKey: 'privacy.profile_visibility.description',
      value: privacyDataState?.profileVisibility ?? PrivacyLevel.PRIVACY_LEVEL_PUBLIC,
      setter: (value: string) => handleSetPrivacy('profileVisibility', value as PrivacyLevel),
    },
    {
      id: 'friends',
      titleKey: 'privacy.friends_visibility.title',
      descKey: 'privacy.friends_visibility.description',
      value: privacyDataState?.friendsVisibility ?? PrivacyLevel.PRIVACY_LEVEL_PUBLIC,
      setter: (value: string) => handleSetPrivacy('friendsVisibility', value as PrivacyLevel),
    },
    {
      id: 'posts',
      titleKey: 'privacy.posts_visibility.title',
      descKey: 'privacy.posts_visibility.description',
      value: privacyDataState?.postsVisibility ?? PrivacyLevel.PRIVACY_LEVEL_PUBLIC,
      setter: (value: string) => handleSetPrivacy('postsVisibility', value as PrivacyLevel),
    },
    {
      id: 'introduce',
      titleKey: 'privacy.introduce_visibility.title',
      descKey: 'privacy.introduce_visibility.description',
      value: privacyDataState?.introduceVisibility ?? PrivacyLevel.PRIVACY_LEVEL_PUBLIC,
      setter: (value: string) => handleSetPrivacy('introduceVisibility', value as PrivacyLevel),
    },
    {
      id: 'gallery',
      titleKey: 'privacy.gallery_visibility.title',
      descKey: 'privacy.gallery_visibility.description',
      value: privacyDataState?.galleryVisibility ?? PrivacyLevel.PRIVACY_LEVEL_PUBLIC,
      setter: (value: string) => handleSetPrivacy('galleryVisibility', value as PrivacyLevel),
    },
  ];

  return (
    <div className="lg:p-3">
      <h1 className="text-xl lg:text-2xl font-bold">{t('privacy.title')}</h1>
      <Show
        when={!isLoading}
        fallback={
          <div className="flex flex-col gap-6 mt-5 lg:p-2 p-1">
            {new Array(Object.keys(PrivacyLevel).length - 1).fill(0).map((_, index) => (
              <Skeleton key={index} className="w-full h-12" />
            ))}
          </div>
        }
      >
        <div className="flex flex-col gap-6 mt-5 lg:p-2 p-1">
          {privacySettings.map(setting => (
            <div
              key={setting.id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4"
            >
              <div className="flex flex-col flex-1">
                <h2 className="text-base lg:text-lg font-bold">{t(setting.titleKey)}</h2>
                <p className="text-xs lg:text-sm text-gray-500 max-w-2xl">{t(setting.descKey)}</p>
              </div>
              <div className="w-full md:w-1/3 min-w-[140px]">
                <RenderSelect
                  value={setting.value}
                  onValueChange={setting.setter}
                  labelKey={setting.titleKey}
                  t={t}
                />
              </div>
            </div>
          ))}
        </div>
      </Show>
    </div>
  );
};

export default Privacy;
