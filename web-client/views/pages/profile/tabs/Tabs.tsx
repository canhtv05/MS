'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  Bookmark,
  Library,
  ClipboardText,
  UsersGroupTwoRounded,
} from '@solar-icons/react-perf/BoldDuotone';
import { PrivacyLevel } from '@/enums/common';
import TabsItem from './TabsItem';
import TabsNavigation, { ITabs } from '../../../../components/TabsNavigation';
import { IDetailUserProfileDTO, IPrivacyDTO } from '@/types/profile';
import IntroduceSection from '../sections/IntroduceSection';
import Wrapper from '@/components/ui/wrapper';
import ImageSection from '../sections/ImageSection';
import { Button } from '@/components/animate-ui/components/buttons/button';
import FriendSection from '../sections/FriendSection';
import { Skeleton } from '@/components/ui/skeleton';
import Show from '@/components/Show';
import PrivateSection from '../sections/PrivateSection';
import { useAuthStore } from '@/stores/auth';

type TTabsId = 'posts' | 'introduce' | 'friends' | 'gallery';
const tabs: ITabs<TTabsId>[] = [
  {
    id: 'posts',
    labelKey: 'posts',
    icon: <Bookmark className="text-current size-[16px]" />,
  },
  {
    id: 'introduce',
    labelKey: 'introduce',
    icon: <ClipboardText className="text-current size-[16px]" />,
  },
  {
    id: 'friends',
    labelKey: 'friends',
    icon: <UsersGroupTwoRounded className="text-current size-[16px]" />,
  },
  {
    id: 'gallery',
    labelKey: 'pictures',
    icon: <Library className="text-current size-[16px]" />,
  },
];

export const getPrivacyKey = (tabId: TTabsId): keyof IPrivacyDTO => {
  const mapping: Record<TTabsId, keyof IPrivacyDTO> = {
    posts: 'postsVisibility',
    introduce: 'introduceVisibility',
    friends: 'friendsVisibility',
    gallery: 'galleryVisibility',
  };
  return mapping[tabId];
};

interface TabsProps {
  data?: IDetailUserProfileDTO;
  isLoading?: boolean;
}

const Tabs = ({ data, isLoading }: TabsProps) => {
  const { user } = useAuthStore();
  const { t } = useTranslation('profile');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tabParam = searchParams.get('tab');
  const activeTab =
    tabs.findIndex(tab => tab.id === tabParam) !== -1
      ? tabs.findIndex(tab => tab.id === tabParam)
      : 0;

  const handleTabClick = (index: number) => {
    const tabId = tabs[index].id;
    const newUrl = `${pathname}?tab=${tabId}`;
    router.push(newUrl, { scroll: false });
  };

  const handleHiddenTabSelect = (tabId: string) => {
    const newUrl = `${pathname}?tab=${tabId}`;
    router.push(newUrl, { scroll: false });
  };

  const isBypass =
    /^\/user\/@[^/]+\/?$/.test(pathname) &&
    (!searchParams.get('tab') || searchParams.get('tab') === 'posts');

  const isDisableSection = !isBypass;

  // Hàm để lấy privacy config cho từng tab
  const getTabPrivacy = (tabId: string) => {
    const privacyKey = getPrivacyKey(tabId as TTabsId);
    const privacy = data?.privacy?.[privacyKey];
    return {
      privacyKey,
      privacyValue: privacy,
      showLock:
        privacy === PrivacyLevel.PRIVACY_LEVEL_PRIVATE ||
        privacy === PrivacyLevel.PRIVACY_LEVEL_FRIENDS_ONLY,
    };
  };

  return (
    <>
      <TabsNavigation
        tabs={tabs}
        activeTab={activeTab}
        isLoading={isLoading}
        onTabClick={handleTabClick}
        onHiddenTabSelect={handleHiddenTabSelect}
        getTabPrivacy={getTabPrivacy}
        translationNamespace="profile"
      />
      <div className="mt-(--sp-layout) w-full rounded-lg">
        <div className="flex lg:flex-row flex-col gap-(--sp-layout) items-start justify-between">
          <Show when={!isDisableSection}>
            <div className="lg:w-[40%] w-full flex flex-col gap-(--sp-layout) h-auto">
              {(() => {
                let condition = false;
                switch (data?.privacy?.profileVisibility) {
                  case PrivacyLevel.PRIVACY_LEVEL_PRIVATE:
                  case PrivacyLevel.PRIVACY_LEVEL_FRIENDS_ONLY:
                    condition = true;
                    break;
                  default:
                    condition = false;
                }
                return (
                  <Show when={condition || !!isLoading}>
                    <Wrapper isLoading={!!isLoading}>
                      <Show when={condition && !isLoading}>
                        <PrivateSection data={data} isLoading={isLoading} />
                      </Show>
                    </Wrapper>
                  </Show>
                );
              })()}

              {(() => {
                const canViewIntroduce =
                  user?.auth?.username === data?.userId ||
                  data?.privacy?.introduceVisibility === PrivacyLevel.PRIVACY_LEVEL_PUBLIC;

                const introduceDescription =
                  user?.auth?.username === data?.userId
                    ? t('introduce_description_you')
                    : t('introduce_description_other', { fullname: data?.fullname ?? '' });

                return (
                  <Wrapper
                    title={t('introduce')}
                    description={introduceDescription}
                    isLoading={!!isLoading}
                    fallback={
                      <div className="p-(--sp-card) flex-1 h-auto custom-bg-1 rounded-md  mb-0">
                        <Skeleton className="h-10 w-full rounded-md" />
                        <IntroduceSection data={data} isLoading={isLoading} />
                      </div>
                    }
                  >
                    <Show
                      when={canViewIntroduce && !isLoading}
                      fallback={
                        <p className="text-center text-sm text-foreground/60 p-4">
                          {t('common:no_data')}
                        </p>
                      }
                    >
                      <IntroduceSection data={data} isLoading={isLoading} />
                    </Show>
                  </Wrapper>
                );
              })()}
              <div className="flex md:flex-row lg:flex-col flex-col gap-(--sp-layout) w-full h-full justify-between">
                {(() => {
                  const isOwner = user?.auth?.username === data?.userId;
                  const canViewPictures =
                    isOwner ||
                    data?.privacy?.galleryVisibility === PrivacyLevel.PRIVACY_LEVEL_PUBLIC;

                  const picturesDescription = isOwner
                    ? t('pictures_description_you')
                    : t('pictures_description_other', { fullname: data?.fullname ?? '' });

                  return (
                    <Wrapper
                      fallback={
                        <div className="p-(--sp-card) flex-1 h-auto custom-bg-1 rounded-md  mb-0">
                          <Skeleton className="h-10 w-full rounded-md" />
                          <ImageSection data={data} isLoading={isLoading} />
                        </div>
                      }
                      title={t('pictures')}
                      description={picturesDescription}
                      isLoading={!!isLoading}
                      button={
                        <Show when={canViewPictures && !isLoading}>
                          <Button size={'sm'} variant="secondary">
                            <span className="font-bold text-foreground/70">
                              {t('common:button.view')}
                            </span>
                          </Button>
                        </Show>
                      }
                    >
                      <Show
                        when={canViewPictures && !isLoading}
                        fallback={
                          <p className="text-center text-sm text-foreground/60 p-4">
                            {t('common:no_data')}
                          </p>
                        }
                      >
                        <ImageSection data={data} isLoading={isLoading} />
                      </Show>
                    </Wrapper>
                  );
                })()}
                {(() => {
                  const isOwner = user?.auth?.username === data?.userId;
                  const canViewFriends =
                    isOwner ||
                    data?.privacy?.friendsVisibility === PrivacyLevel.PRIVACY_LEVEL_PUBLIC;

                  const friendsDescription = isOwner
                    ? t('friends_description_you')
                    : t('friends_description_other', { fullname: data?.fullname ?? '' });

                  return (
                    <Wrapper
                      fallback={
                        <div className="p-(--sp-card) flex-1 h-auto custom-bg-1 rounded-md  mb-0">
                          <Skeleton className="h-10 w-full rounded-md" />
                          <ImageSection data={data} isLoading={isLoading} />
                        </div>
                      }
                      isLoading={!!isLoading}
                      title={t('friends')}
                      description={friendsDescription}
                      button={
                        <Show when={canViewFriends && !isLoading}>
                          <Button size={'sm'} variant="secondary">
                            <span className="font-bold text-foreground/70">
                              {t('common:button.view')}
                            </span>
                          </Button>
                        </Show>
                      }
                    >
                      <Show
                        when={canViewFriends && !isLoading}
                        fallback={
                          <p className="text-center text-sm text-foreground/60 p-4">
                            {t('common:no_data')}
                          </p>
                        }
                      >
                        <FriendSection data={data} isLoading={isLoading} />
                      </Show>
                    </Wrapper>
                  );
                })()}
              </div>
            </div>
          </Show>
          <div className="w-full rounded-md">
            <TabsItem tabs={tabs} activeTab={activeTab} data={data} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Tabs;
