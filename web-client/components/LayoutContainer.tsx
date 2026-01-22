'use client';

import { ReactNode } from 'react';
import Show from './Show';
import { useNavigation } from '@/contexts/NavigationContext';
import { cn } from '@/lib/utils';

interface ILayoutContainerProps {
  children: ReactNode;
  navigation?: ReactNode;
  sidebar?: ReactNode;
  className?: string;
  minHeightClassName?: string;
}

const LayoutContainer = ({
  children,
  navigation,
  sidebar,
  className,
  minHeightClassName = 'min-h-screen',
}: ILayoutContainerProps) => {
  const { isCollapsed } = useNavigation();
  return (
    <div
      className={cn(
        'flex relative items-start justify-center bg-[#F9FBFC] pt-[calc(var(--header-height)+var(--sp-layout))] md:px-[var(--sp-layout)] px-0 dark:bg-gray-900 w-full box-border',
        minHeightClassName,
        className,
      )}
    >
      <Show when={!!navigation}>
        <div
          className={cn(
            'hidden md:block transition-[width] duration-300 ease-out shrink-0 md:w-[var(--sidebar-width)]',
            isCollapsed ? 'lg:w-[var(--sidebar-width)]' : 'lg:w-64',
          )}
          aria-hidden="true"
        />
        <div
          className={cn(
            'fixed bottom-0 left-1/2 -translate-x-1/2 md:bottom-auto md:top-[calc(var(--header-height)+var(--sp-layout))] md:left-[9px] md:translate-x-0 md:fixed md:h-[calc(100vh-4.5rem)] md:overflow-x-visible md:overflow-y-visible md:w-[var(--sidebar-width)] lg:left-[9px] lg:h-[calc(100vh-4.5rem)] lg:overflow-x-visible lg:overflow-y-visible w-auto z-50 transition-[width] duration-300 ease-out',
            isCollapsed ? 'lg:w-[var(--sidebar-width)]' : 'lg:w-64',
          )}
        >
          {navigation}
        </div>
      </Show>
      <div className="fixed top-[var(--header-height)] left-0 right-0 bottom-0 h-[var(--sp-layout)] z-40 bg-[#F9FBFC] dark:bg-gray-900 w-full"></div>
      <main
        className={cn(
          'relative w-full flex-1 md:mb-0 mb-17 lg:px-[var(--sp-layout)] pl-[var(--sp-layout)] md:pr-0! pr-[var(--sp-layout)]',
        )}
      >
        {children}
      </main>
      <Show when={!!sidebar}>
        <div className="sticky top-[var(--sp-layout)] hidden lg:block xl:w-72 lg:w-64 self-start">
          {sidebar}
        </div>
      </Show>
    </div>
  );
};

export default LayoutContainer;
