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
import { startTransition, useEffect, useState } from 'react';
import { PrivacyLevel } from '@/enums/common';
import { TFunction } from 'i18next';
import { useProfileStore } from '@/stores/profile';

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
  const { userProfile } = useProfileStore();
  const [profileVisibility, setProfileVisibility] = useState<string>(
    userProfile?.privacy?.profileVisibility || PrivacyLevel.PRIVACY_LEVEL_PUBLIC,
  );
  const [friendsVisibility, setFriendsVisibility] = useState<string>(
    userProfile?.privacy?.friendsVisibility || PrivacyLevel.PRIVACY_LEVEL_PUBLIC,
  );
  const [postsVisibility, setPostsVisibility] = useState<string>(
    userProfile?.privacy?.postsVisibility || PrivacyLevel.PRIVACY_LEVEL_PUBLIC,
  );

  useEffect(() => {
    if (userProfile) {
      startTransition(() => {
        setProfileVisibility(userProfile.privacy.profileVisibility);
        setFriendsVisibility(userProfile.privacy.friendsVisibility);
        setPostsVisibility(userProfile.privacy.postsVisibility);
      });
    }
  }, [userProfile]);

  const privacySettings = [
    {
      id: 'profile',
      titleKey: 'privacy.profile_visibility.title',
      descKey: 'privacy.profile_visibility.description',
      value: profileVisibility,
      setter: setProfileVisibility,
    },
    {
      id: 'friends',
      titleKey: 'privacy.friends_visibility.title',
      descKey: 'privacy.friends_visibility.description',
      value: friendsVisibility,
      setter: setFriendsVisibility,
    },
    {
      id: 'posts',
      titleKey: 'privacy.posts_visibility.title',
      descKey: 'privacy.posts_visibility.description',
      value: postsVisibility,
      setter: setPostsVisibility,
    },
  ];

  return (
    <div className="lg:p-3">
      <h1 className="text-xl lg:text-2xl font-bold">{t('privacy.title')}</h1>
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
    </div>
  );
};

export default Privacy;
