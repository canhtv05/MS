'use client';

import { ReactNode } from 'react';
import Show from './Show';
import { cn } from '@/lib/utils';
import { useNavigation } from '@/contexts/navigation-context';

interface ILayoutContainerProps {
  children: ReactNode;
  navigation?: ReactNode;
  sidebar?: ReactNode;
}

const LayoutContainer = ({ children, navigation, sidebar }: ILayoutContainerProps) => {
  const { isCollapsed } = useNavigation();

  return (
    <div className="flex relative items-start justify-center bg-[#F9FBFC] pt-14 md:px-[9px] px-0 dark:bg-gray-900 min-h-screen w-full">
      <Show when={!!navigation}>
        <div
          className={cn(
            'hidden md:block transition-[width] duration-300 ease-out shrink-0 md:w-[72px]',
            isCollapsed ? 'lg:w-[72px]' : 'lg:w-64',
          )}
          aria-hidden="true"
        />
        {/* Navigation thực tế */}
        <div
          className={cn(
            'fixed bottom-0 left-1/2 -translate-x-1/2 md:bottom-auto md:top-18 md:left-[9px] md:translate-x-0 md:fixed md:h-[calc(100vh-4.5rem)] md:overflow-x-visible md:overflow-y-visible md:w-[72px] lg:left-[9px] lg:h-[calc(100vh-4.5rem)] lg:overflow-x-visible lg:overflow-y-visible w-auto z-50 transition-[width] duration-300 ease-out',
            isCollapsed ? 'lg:w-[72px]' : 'lg:w-64',
          )}
        >
          {navigation}
        </div>
      </Show>
      <div className="fixed top-14 left-0 right-0 bottom-0 h-4 z-40 bg-[#F9FBFC] dark:bg-gray-900 w-full"></div>
      <main className="relative w-full flex-1 pb-3 md:mb-0 mb-17 lg:px-3 pl-3 md:pr-0! pr-3 pt-4">
        {children}
      </main>
      <Show when={!!sidebar}>
        <div className="sticky top-18 hidden lg:block xl:w-72 lg:w-64 self-start">{sidebar}</div>
      </Show>
    </div>
  );
};

export default LayoutContainer;
