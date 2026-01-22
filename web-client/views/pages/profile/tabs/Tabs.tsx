'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  Bookmark,
  Library,
  ClipboardText,
  UsersGroupTwoRounded,
} from '@solar-icons/react-perf/BoldDuotone';
import useViewport from '@/hooks/use-view-port';
import { Viewport } from '@/enums/common';
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
import { IDetailUserProfileDTO } from '@/types/profile';
import IntroduceSection from '../sections/IntroduceSection';
import Wrapper from '../components/Wrapper';
import ImageSection from '../sections/ImageSection';
import { Button } from '@/components/animate-ui/components/buttons/button';
import FriendSection from '../sections/FriendSection';
import { Skeleton } from '@/components/customs/skeleton';
import Show from '@/components/Show';

export interface ITabs {
  id: string;
  labelKey: string;
  icon: ReactNode;
}

const tabs: ITabs[] = [
  { id: 'posts', labelKey: 'posts', icon: <Bookmark className="text-current size-[16px]" /> },
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
  { id: 'pictures', labelKey: 'pictures', icon: <Library className="text-current size-[16px]" /> },
];

interface TabsProps {
  data?: IDetailUserProfileDTO;
  isLoading?: boolean;
}

const Tabs = ({ data, isLoading }: TabsProps) => {
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

  return (
    <div className="w-full border-t dark:border-foreground/20">
      <div className="relative px-3 rounded-b-lg w-full custom-bg-1 shadow-[0_8px_10px_-4px_rgba(0,0,0,0.08)]">
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
                    <div className="flex gap-2 items-center justify-center">
                      {tab.icon}
                      <span className="truncate">{t(tab.labelKey)}</span>
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
                  <DropdownMenu>
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
                    <DropdownMenuContent className="group">
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
                          <div className="flex gap-2 items-center">
                            {tab.icon}
                            {t(tab.labelKey)}
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
          <div className="lg:w-[40%] w-full flex flex-col gap-(--sp-layout) h-auto">
            <Wrapper title={t('introduce')}>
              <IntroduceSection data={data} isLoading={isLoading} />
            </Wrapper>
            <div className="flex md:flex-row lg:flex-col flex-col gap-3 w-full h-full justify-between">
              <Wrapper
                fallback={
                  <div className="p-(--sp-card) flex-1 h-auto custom-bg-1 rounded-md shadow-[0_0_10px_0_rgba(0,0,0,0.07)] mb-0">
                    <Skeleton className="h-10 w-full rounded-md" />
                    <ImageSection data={data} isLoading={isLoading} />
                  </div>
                }
                title={t('pictures')}
                description={t('pictures_description')}
                isLoading={isLoading}
                button={
                  <Button size={'sm'} variant="secondary">
                    <span className="font-bold text-foreground/70">{t('common:button.view')}</span>
                  </Button>
                }
              >
                <ImageSection data={data} isLoading={isLoading} />
              </Wrapper>
              <Wrapper
                fallback={
                  <div className="p-(--sp-card) flex-1 h-auto custom-bg-1 rounded-md shadow-[0_0_10px_0_rgba(0,0,0,0.07)] mb-0">
                    <Skeleton className="h-10 w-full rounded-md" />
                    <ImageSection data={data} isLoading={isLoading} />
                  </div>
                }
                isLoading={isLoading}
                title={t('friends')}
                description={t('friends_description')}
                button={
                  <Button size={'sm'} variant="secondary">
                    <span className="font-bold text-foreground/70">{t('common:button.view')}</span>
                  </Button>
                }
              >
                <FriendSection data={data} isLoading={isLoading} />
              </Wrapper>
            </div>
          </div>
          <div className="w-full rounded-md">
            <Wrapper>
              <TabsItem tabs={tabs} activeTab={activeTab} t={t} data={data} />
            </Wrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
