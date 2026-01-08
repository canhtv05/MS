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
import ProfilePageTabsItem from './ProfilePageTabsItem';
import { IDetailUserProfileDTO } from '@/types/profile';

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

interface ProfilePageTabsProps {
  data?: IDetailUserProfileDTO;
}

const ProfilePageTabs = ({ data }: ProfilePageTabsProps) => {
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
      <div className="relative md:px-6 px-[10px] rounded-b-lg w-full bg-white dark:bg-gray-800 shadow-[0_8px_10px_-4px_rgba(0,0,0,0.08)]">
        <div className="relative">
          <div className="absolute bottom-0 left-0 right-0 h-px w-full" />
          <div className="relative">
            <div className="flex">
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
            </div>
            <div
              className="absolute rounded-lg -bottom-px h-[3px] bg-primary transition-[width,transform] duration-300 ease-out"
              style={{
                width: `${100 / renderItemsCount}%`,
                transform: `translateX(${indicatorIndex * 100}%)`,
              }}
            />
          </div>
        </div>
      </div>
      <div className="mt-3 md:px-6 px-4 md:py-6 py-4 w-full bg-white dark:bg-gray-800 rounded-lg shadow-[0_0_10px_0_rgba(0,0,0,0.07)]">
        <div className="flex lg:flex-row flex-col gap-3 items-center justify-between">
          <div className="bg-red-500 lg:w-[50%] w-full h-full rounded-md">k</div>
          <ProfilePageTabsItem tabs={tabs} activeTab={activeTab} t={t} data={data} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePageTabs;
