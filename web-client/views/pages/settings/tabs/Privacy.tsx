'use client';

import {
  Select,
  SelectArrow,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/animate-ui/components/radix/select';
import { useTranslation } from 'react-i18next';
import { PrivacyLevel } from '@/enums/common';
import { TFunction } from 'i18next';
import { usePrivacyQuery } from '@/services/queries/profile';
import { IUserProfilePrivacyDTO } from '@/types/profile';
import { useProfileMutation } from '@/services/mutations/profile';
import Show from '@/components/Show';
import { Skeleton } from '@/components/customs/skeleton';

interface IRenderSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  labelKey: string;
  t: TFunction<'settings', undefined>;
}

const RenderSelect = ({ value, onValueChange, labelKey, t }: IRenderSelectProps) => {
  const privacyLevels = [
    {
      value: PrivacyLevel.PRIVACY_LEVEL_PUBLIC,
      label: t(`common:privacy_level.${PrivacyLevel.PRIVACY_LEVEL_PUBLIC}`),
    },
    {
      value: PrivacyLevel.PRIVACY_LEVEL_PRIVATE,
      label: t(`common:privacy_level.${PrivacyLevel.PRIVACY_LEVEL_PRIVATE}`),
    },
    {
      value: PrivacyLevel.PRIVACY_LEVEL_FRIENDS_ONLY,
      label: t(`common:privacy_level.${PrivacyLevel.PRIVACY_LEVEL_FRIENDS_ONLY}`),
    },
    {
      value: PrivacyLevel.PRIVACY_LEVEL_CUSTOM,
      label: t(`common:privacy_level.${PrivacyLevel.PRIVACY_LEVEL_CUSTOM}`),
    },
  ];

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full transition-global border-gray-200 bg-white/50 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/50">
        <SelectValue placeholder={t('privacy.select_placeholder')} />
      </SelectTrigger>
      <SelectContent className="z-100">
        <SelectArrow />
        <SelectGroup>
          <SelectLabel>{t(labelKey)}</SelectLabel>
          {privacyLevels.map(item => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const Privacy = () => {
  const { t } = useTranslation('settings');
  const { data: privacyData, isLoading } = usePrivacyQuery();
  const { updatePrivacyMutation: updatePrivacyMutation } = useProfileMutation();

  const handleSetPrivacy = (key: keyof Omit<IUserProfilePrivacyDTO, 'id'>, value: PrivacyLevel) => {
    const current: Omit<IUserProfilePrivacyDTO, 'id'> = {
      profileVisibility: privacyData?.profileVisibility ?? PrivacyLevel.PRIVACY_LEVEL_PUBLIC,
      friendsVisibility: privacyData?.friendsVisibility ?? PrivacyLevel.PRIVACY_LEVEL_PUBLIC,
      postsVisibility: privacyData?.postsVisibility ?? PrivacyLevel.PRIVACY_LEVEL_PUBLIC,
    };
    const next = { ...current, [key]: value };
    updatePrivacyMutation.mutate({
      profileVisibility: next.profileVisibility,
      friendsVisibility: next.friendsVisibility,
      postsVisibility: next.postsVisibility,
    });
  };

  const privacySettings = [
    {
      id: 'profile',
      titleKey: 'privacy.profile_visibility.title',
      descKey: 'privacy.profile_visibility.description',
      value: privacyData?.profileVisibility ?? PrivacyLevel.PRIVACY_LEVEL_PUBLIC,
      setter: (value: string) => handleSetPrivacy('profileVisibility', value as PrivacyLevel),
    },
    {
      id: 'friends',
      titleKey: 'privacy.friends_visibility.title',
      descKey: 'privacy.friends_visibility.description',
      value: privacyData?.friendsVisibility ?? PrivacyLevel.PRIVACY_LEVEL_PUBLIC,
      setter: (value: string) => handleSetPrivacy('friendsVisibility', value as PrivacyLevel),
    },
    {
      id: 'posts',
      titleKey: 'privacy.posts_visibility.title',
      descKey: 'privacy.posts_visibility.description',
      value: privacyData?.postsVisibility ?? PrivacyLevel.PRIVACY_LEVEL_PUBLIC,
      setter: (value: string) => handleSetPrivacy('postsVisibility', value as PrivacyLevel),
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
