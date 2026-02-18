'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LockKeyholeMinimalistic } from '@solar-icons/react-perf/BoldDuotone';
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
import { Skeleton } from '@/components/ui/skeleton';
import Show from '@/components/Show';

export interface ITabs<T> {
  id: T | string;
  labelKey: string;
  icon?: ReactNode;
}

export interface TabPrivacyConfig {
  privacyKey?: string;
  privacyValue?: PrivacyLevel;
  showLock?: boolean;
}

interface TabsNavigationProps<T> {
  tabs: ITabs<T>[];
  activeTab: number;
  isLoading?: boolean;
  maxVisible?: number | { mobile?: number; tablet?: number; desktop?: number };
  onTabClick: (index: number) => void;
  onHiddenTabSelect: (tabId: string) => void;
  translationNamespace?: string;
  getTabPrivacy?: (tabId: string) => TabPrivacyConfig | null;
  moreLabelKey?: string;
  variant?: 'default' | 'no-border';
}

const TabsNavigation = <T,>({
  tabs,
  activeTab,
  isLoading = false,
  maxVisible: maxVisibleProp,
  onTabClick,
  onHiddenTabSelect,
  translationNamespace = 'profile',
  getTabPrivacy,
  moreLabelKey = 'more',
  variant = 'default',
}: TabsNavigationProps<T>) => {
  const { t } = useTranslation(translationNamespace);
  const { width } = useViewport();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const handleSetMounted = () => {
      setMounted(true);
    };
    handleSetMounted();
  }, []);

  const activeTabId = tabs[activeTab]?.id;
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Tính toán maxVisible động
  const calculateMaxVisible = (): number => {
    // Nếu truyền vào là số cụ thể
    if (typeof maxVisibleProp === 'number') {
      return maxVisibleProp;
    }

    // Nếu truyền vào là object với breakpoints
    if (maxVisibleProp && typeof maxVisibleProp === 'object') {
      if (!mounted) return tabs.length;
      if (width < Viewport.MD) return maxVisibleProp.mobile ?? 2;
      if (width < Viewport.LG) return maxVisibleProp.tablet ?? 3;
      return maxVisibleProp.desktop ?? tabs.length;
    }

    // Mặc định: tự động tính toán dựa trên viewport
    if (!mounted) return tabs.length;
    if (width < Viewport.MD) return 2;
    if (width < Viewport.LG) return 3;
    return tabs.length;
  };

  const maxVisible = calculateMaxVisible();

  const visibleTabs = tabs.slice(0, maxVisible);
  const hiddenTabs = tabs.slice(maxVisible);
  const showDropdown = hiddenTabs.length > 0;
  const renderItemsCount = visibleTabs.length + (showDropdown ? 1 : 0);

  const isHiddenActive = hiddenTabs.some(tab => tab.id === activeTabId);
  const activeRenderIndex = isHiddenActive ? visibleTabs.length : activeTab;

  const indicatorIndex = hoverIndex !== null ? hoverIndex : activeRenderIndex;

  return (
    <div
      className={cn(
        'w-full border-t dark:border-foreground/20',
        variant === 'no-border' && 'border-none',
      )}
    >
      <div
        className={cn(
          'relative rounded-b-lg w-full custom-bg-1',
          variant === 'no-border' ? 'px-0' : 'px-3',
        )}
      >
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
                    key={tab.id as string}
                    className={`flex-1 py-3 text-sm flex gap-1 group items-center justify-center font-medium cursor-pointer
                  ${
                    activeTab === index
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground not-[&:hover]:transition-none hover:transition-colors hover:duration-300'
                  }`}
                    onClick={() => onTabClick(index)}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    <div className="flex gap-2 items-center justify-center relative">
                      {tab.icon}
                      <span className="truncate">{t(tab.labelKey)}</span>
                      {(() => {
                        if (!getTabPrivacy) return null;
                        const privacyConfig = getTabPrivacy(tab.id as string);
                        const shouldShowLock =
                          privacyConfig?.showLock ??
                          (privacyConfig?.privacyValue === PrivacyLevel.PRIVACY_LEVEL_PRIVATE ||
                            privacyConfig?.privacyValue ===
                              PrivacyLevel.PRIVACY_LEVEL_FRIENDS_ONLY);
                        return (
                          shouldShowLock && (
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
                          <span className="truncate">{t(moreLabelKey) || 'More'}</span>
                          <AltArrowDown size={14} className="mt-[2px]" />
                        </div>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="group z-100">
                      <DropdownMenuArrow />
                      {hiddenTabs.map(tab => (
                        <DropdownMenuItem
                          key={tab.id as string}
                          onClick={() => onHiddenTabSelect(tab.id as string)}
                          className={cn(
                            'cursor-pointer outline-none transition-[background-color,color] duration-200',
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
                              if (!getTabPrivacy) return null;
                              const privacyConfig = getTabPrivacy(tab.id as string);
                              const shouldShowLock =
                                privacyConfig?.showLock ??
                                (privacyConfig?.privacyValue ===
                                  PrivacyLevel.PRIVACY_LEVEL_PRIVATE ||
                                  privacyConfig?.privacyValue ===
                                    PrivacyLevel.PRIVACY_LEVEL_FRIENDS_ONLY);
                              return (
                                shouldShowLock && (
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
    </div>
  );
};

export default TabsNavigation;
