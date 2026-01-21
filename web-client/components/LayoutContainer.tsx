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
      className={`flex relative items-start justify-center bg-[#F9FBFC] pt-14 mt-1 md:px-3 px-0 dark:bg-gray-900 ${minHeightClassName} w-full box-border ${className ?? ''}`}
    >
      <Show when={!!navigation}>
        <div className="lg:block fixed top-[76px] md:translate-x-0 -translate-x-1/2 md:left-0 left-1/2 md:bottom-auto bottom-0 lg:w-auto w-auto z-40 pl-3">
          {navigation}
        </div>
      </Show>
      <div className="fixed top-14 left-0 right-0 bottom-0 h-5 z-40 bg-[#F9FBFC] dark:bg-gray-900 w-full"></div>
      <main
        className={cn(
          'relative w-full z-30 flex-1 lg:pl-0 pl-3 pb-3 md:mb-0 mb-17 transition-[margin] duration-300 ease-out md:pr-0! pr-3 pt-4',
          isCollapsed ? 'lg:ml-22' : 'lg:ml-[272px]',
        )}
      >
        {children}
      </main>
      <Show when={!!sidebar}>
        <div className="sticky top-(--sp-layout) hidden lg:block xl:w-72 lg:w-64 self-start">
          {sidebar}
        </div>
      </Show>
    </div>
  );
};

export default LayoutContainer;
