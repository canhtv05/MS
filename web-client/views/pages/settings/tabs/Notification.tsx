'use client';

import { useTranslation } from 'react-i18next';
import { startTransition, useEffect, useState } from 'react';
import { PrivacyLevel } from '@/enums/common';
import { useMyProfileStore } from '@/stores/profile';
import RenderSelect from '../../profile/components/RenderSelect';

const Notification = () => {
  const { t } = useTranslation('settings');
  const { myProfile: userProfile } = useMyProfileStore();
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
      titleKey: 'Thời gian sử dụng màn hình hằng ngày',
      descKey: 'Nhận thông báo nếu bạn đã đạt giới hạn thời gian sử dụng trên LeafHub',
      value: profileVisibility,
      setter: setProfileVisibility,
    },
    {
      id: 'friends',
      titleKey: 'Nghỉ giải lao sau thời gian sử dụng màn hình',
      descKey: 'Nhận lời nhắc tạm thời dừng xem',
      value: friendsVisibility,
      setter: setFriendsVisibility,
    },
    {
      id: 'posts',
      titleKey: 'Giờ ngủ',
      descKey: 'Nhận lời nhắc khi sắp đến giờ đi ngủ',
      value: postsVisibility,
      setter: setPostsVisibility,
    },
    {
      id: 'sleep',
      titleKey: 'Cập nhật thời gian sử dụng hằng tuần',
      descKey: 'Hãy luôn cập nhật thông tin về thời gian sử dụng của bạn từ Hộp thư',
      value: postsVisibility,
      setter: setPostsVisibility,
    },
    {
      id: 'sleep2',
      titleKey: 'Tóm tắt',
      descKey:
        'Số liệu hằng tuần của bạn bao gồm thời gian bạn sử dụng ứng dụng và xem trên LeafHub',
      value: postsVisibility,
      setter: setPostsVisibility,
    },
  ];

  return (
    <div className="lg:p-3">
      <h1 className="text-xl lg:text-2xl font-bold">{t('notification.title')}</h1>
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

export default Notification;
