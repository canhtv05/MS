'use client';

import { cn } from '@/lib/utils';
import { TFunction } from 'i18next';
import { Loader2Icon } from '@/components/animate-ui/icons';
import { AnimatePresence } from 'motion/react';
import { Dispatch, forwardRef, SetStateAction } from 'react';
import HomeHeaderSearchCard from './HomeHeaderSearchCard';

interface IHomeHeaderSearch {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setIsShowSearch?: Dispatch<SetStateAction<boolean>>;
  isShowSearch: boolean;
  isLoading: boolean;
  debouncedValue: string;
  t: TFunction<'translate', undefined>;
}

const HomeHeaderSearchLG = forwardRef(
  (
    { isShowSearch, isLoading, debouncedValue }: IHomeHeaderSearch,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'z-50 rounded-lg shadow-lg',
          'fixed top-[64px] inset-x-0 md:px-0 px-5',
          'lg:absolute lg:w-full lg:max-w-xs lg:top-10 lg:inset-x-auto lg:left-0',
        )}
      >
        <div
          className={cn(
            'bg-gray-50 dark:bg-gray-700 rounded-lg max-h-[40vh] ',
            isLoading ? 'overflow-hidden' : 'overflow-y-auto',
          )}
        >
          {isLoading ? (
            <div className="flex mt-2 items-center justify-center">
              <Loader2Icon className="animate-spin size-8 text-foreground" />
            </div>
          ) : isShowSearch && debouncedValue.trim() !== '' && !isLoading ? (
            <AnimatePresence>
              {Array.from({ length: 20 }).map((_, index) => (
                <HomeHeaderSearchCard key={index} value={debouncedValue} index={index} />
              ))}
            </AnimatePresence>
          ) : null}
        </div>
      </div>
    );
  },
);
HomeHeaderSearchLG.displayName = 'HomeHeaderSearchLG';

export default HomeHeaderSearchLG;
