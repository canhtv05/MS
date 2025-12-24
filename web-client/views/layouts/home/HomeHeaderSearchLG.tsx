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
          isLoading ? 'overflow-hidden' : 'overflow-y-auto',
          'z-40 relative max-h-[40vh] bg-gray-50 dark:bg-gray-700 rounded-lg',
          'fixed top-[60px] left-5 right-5 w-auto shadow-lg',
          'lg:absolute lg:w-full max-w-xs lg:top-10 lg:left-0 lg:right-auto',
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
    );
  },
);
HomeHeaderSearchLG.displayName = 'HomeHeaderSearchLG';

export default HomeHeaderSearchLG;
