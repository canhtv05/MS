'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  Bookmark,
  Library,
  ClipboardText,
  UsersGroupTwoRounded,
  LockKeyholeMinimalistic,
} from '@solar-icons/react-perf/BoldDuotone';
import useViewport from '@/hooks/use-view-port';
import { PrivacyLevel, Viewport } from '@/enums/common';
import { AltArrowDown } from '@solar-icons/react-perf/Outline';
import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu';
import { cn } from '@/lib/utils';
import TabsItem from './TabsItem';
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
export interface ITabs {
  id: TTabsId;
  labelKey: string;
  icon: ReactNode;
}

const tabs: ITabs[] = [
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

const getPrivacyKey = (tabId: TTabsId): keyof IPrivacyDTO => {
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
  const { width } = useViewport();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const handleSetMounted = () => {
      setMounted(true);
    };
    handleSetMounted();
  }, []);

  const tabParam = searchParams.get('tab');
  const activeTab =
    tabs.findIndex(tab => tab.id === tabParam) !== -1
      ? tabs.findIndex(tab => tab.id === tabParam)
      : 0;
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handleTabClick = (index: number) => {
    const tabId = tabs[index].id;
    const newUrl = `${pathname}?tab=${tabId}`;
    router.push(newUrl, { scroll: false });
  };

  const activeTabId = tabs[activeTab].id;

  const maxVisible = !mounted
    ? tabs.length
    : width < Viewport.MD
      ? 2
      : width < Viewport.LG
        ? 3
        : tabs.length;

  const visibleTabs = tabs.slice(0, maxVisible);
  const hiddenTabs = tabs.slice(maxVisible);
  const showDropdown = hiddenTabs.length > 0;
  const renderItemsCount = visibleTabs.length + (showDropdown ? 1 : 0);

  const isHiddenActive = hiddenTabs.some(tab => tab.id === activeTabId);
  const activeRenderIndex = isHiddenActive ? visibleTabs.length : activeTab;

  const indicatorIndex = hoverIndex !== null ? hoverIndex : activeRenderIndex;

  const handleHiddenTabSelect = (tabId: string) => {
    const newUrl = `${pathname}?tab=${tabId}`;
    router.push(newUrl, { scroll: false });
  };

  const isBypass =
    /^\/user\/@[^/]+\/?$/.test(pathname) &&
    (!searchParams.get('tab') || searchParams.get('tab') === 'posts');

  const isDisableSection = !isBypass;

  return (
    <div className="w-full border-t dark:border-foreground/20">
      <div className="relative px-3 rounded-b-lg w-full custom-bg-1 ">
        <div className="relative">
          <div className="absolute bottom-0 left-0 right-0 h-px w-full" />
          <div className="relative">
            <div className="flex">
              <Show
                when={!isLoading}
                fallback={Array.from({ length: mounted ? maxVisible : 3 }).map((_, index) => (
                  <div key={index} className="flex-1 py-1 px-0 mx-1.5">
                    <Skeleton className="h-8 w-full rounded-md" />
                  </div>
                ))}
              >
                {visibleTabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    className={`flex-1 py-3 text-sm flex gap-1 group items-center justify-center font-medium cursor-pointer
                  ${
                    activeTab === index
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground not-[&:hover]:transition-none hover:transition-colors hover:duration-300'
                  }`}
                    onClick={() => handleTabClick(index)}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    <div className="flex gap-2 items-center justify-center relative">
                      {tab.icon}
                      <span className="truncate">{t(tab.labelKey)}</span>
                      {(() => {
                        const privacyKey = getPrivacyKey(tab.id);
                        const privacy = data?.privacy?.[privacyKey];
                        const condition =
                          privacy === PrivacyLevel.PRIVACY_LEVEL_PRIVATE ||
                          privacy === PrivacyLevel.PRIVACY_LEVEL_FRIENDS_ONLY;
                        return (
                          condition && (
                            <LockKeyholeMinimalistic className="text-current absolute size-[10px] top-[14px] left-[8px]" />
                          )
                        );
                      })()}
                    </div>
                  </button>
                ))}
              </Show>
              <Show
                when={!isLoading}
                fallback={
                  <div className="flex-1 py-1 px-0 mx-1.5 mr-0">
                    <Skeleton className="h-full w-full" />
                  </div>
                }
              >
                {showDropdown && (
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={`flex-1 py-3 text-sm flex gap-1 group items-center justify-center font-medium cursor-pointer outline-none
                      ${
                        isHiddenActive
                          ? 'text-primary'
                          : 'text-muted-foreground hover:text-foreground not-[&:hover]:transition-none hover:transition-colors hover:duration-300'
                      }`}
                        onMouseEnter={() => setHoverIndex(visibleTabs.length)}
                        onMouseLeave={() => setHoverIndex(null)}
                      >
                        <div className="flex gap-1 items-center justify-center">
                          <span className="truncate">{t('more') || 'More'}</span>
                          <AltArrowDown size={14} className="mt-[2px]" />
                        </div>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="group z-100">
                      <DropdownMenuArrow />
                      {hiddenTabs.map(tab => (
                        <DropdownMenuItem
                          key={tab.id}
                          onClick={() => handleHiddenTabSelect(tab.id)}
                          className={cn(
                            'cursor-pointer outline-none focus:bg-muted/50 transition-[background-color] duration-200',
                            'text-muted-foreground focus:text-primary!',
                            activeTabId === tab.id
                              ? 'text-primary group-hover:text-muted-foreground! group-hover:focus:text-primary!'
                              : '',
                          )}
                        >
                          <div className="flex gap-2 items-center relative">
                            {tab.icon}
                            <span className="truncate">{t(tab.labelKey)}</span>
                            {(() => {
                              const privacyKey = getPrivacyKey(tab.id);
                              const privacy = data?.privacy?.[privacyKey];
                              const condition =
                                privacy === PrivacyLevel.PRIVACY_LEVEL_PRIVATE ||
                                privacy === PrivacyLevel.PRIVACY_LEVEL_FRIENDS_ONLY;
                              return (
                                condition && (
                                  <LockKeyholeMinimalistic className="text-current absolute size-[10px] top-[14px] left-[8px]" />
                                )
                              );
                            })()}
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </Show>
            </div>
            <Show when={!isLoading}>
              <div
                className="absolute rounded-lg -bottom-px h-[3px] bg-primary transition-[width,transform] duration-300 ease-out"
                style={{
                  width: `calc(${100 / renderItemsCount}%)`,
                  transform: `translateX(${indicatorIndex * 100}%)`,
                }}
              ></div>
            </Show>
          </div>
        </div>
      </div>
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
            <TabsItem tabs={tabs} activeTab={activeTab} data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
