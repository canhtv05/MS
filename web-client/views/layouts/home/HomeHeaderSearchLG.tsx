'use client';

import { cn } from '@/lib/utils';
import { TFunction } from 'i18next';
import { Loader2Icon } from '@/components/animate-ui/icons';
import { AnimatePresence } from 'motion/react';
import { Dispatch, forwardRef, SetStateAction } from 'react';
import { Portal } from '@/components/animate-ui/components/portal';
import Show from '@/components/Show';
import HomeHeaderSearchCard from './HomeHeaderSearchCard';

interface IHomeHeaderSearch {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setIsShowSearch?: Dispatch<SetStateAction<boolean>>;
  isShowSearch: boolean;
  isLoading: boolean;
  debouncedValue: string;
  readyValue: string;
  t: TFunction<'translate', undefined>;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

const HomeHeaderSearchLG = forwardRef(
  (
    { isShowSearch, isLoading, debouncedValue, readyValue, containerRef }: IHomeHeaderSearch,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    const shouldShowResults =
      isShowSearch && debouncedValue.trim() !== '' && !isLoading && debouncedValue === readyValue;

    return (
      <Show when={isShowSearch}>
        <Portal ref={ref} containerRef={containerRef} className="fixed! z-100!">
          <div
            className={cn(
              'bg-gray-50 dark:bg-gray-700 rounded-lg max-h-[40vh] w-xs!',
              isLoading ? 'overflow-hidden' : 'overflow-y-auto',
            )}
          >
            <Show
              when={isLoading}
              fallback={
                <Show when={shouldShowResults}>
                  <AnimatePresence>
                    {Array.from({ length: 20 }).map((_, index) => (
                      <HomeHeaderSearchCard key={index} value={debouncedValue} index={index} />
                    ))}
                  </AnimatePresence>
                </Show>
              }
            >
              <div className="flex mt-2 items-center justify-center">
                <Loader2Icon className="animate-spin size-8 text-foreground" />
              </div>
            </Show>
          </div>
        </Portal>
      </Show>
    );
  },
);
HomeHeaderSearchLG.displayName = 'HomeHeaderSearchLG';

export default HomeHeaderSearchLG;
