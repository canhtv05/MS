'use client';

import { ReactNode } from 'react';
import Show from '../../components/Show';
import { useNavigation } from '@/contexts/NavigationContext';
import { cn } from '@/lib/utils';

interface ILayoutContainerProps {
  children: ReactNode;
  navigation?: ReactNode;
  sidebar?: ReactNode;
  className?: string;
}

const LayoutContainer = ({ children, navigation, sidebar, className }: ILayoutContainerProps) => {
  const { isCollapsed } = useNavigation();
  return (
    <div
      className={cn(
        'flex relative items-start justify-center bg-[#F9FBFC] pt-[calc(var(--header-height)+var(--sp-layout))] md:px-(--sp-layout) px-0 dark:bg-gray-900 w-full box-border',
        className,
      )}
    >
      <Show when={!!navigation}>
        <div
          className={cn(
            'hidden md:block transition-[width] duration-300 ease-out shrink-0 md:w-(--sidebar-width)',
            isCollapsed ? 'lg:w-(--sidebar-width)' : 'lg:w-64',
          )}
          aria-hidden="true"
        />
        <div
          className={cn(
            'fixed bottom-0 left-1/2 -translate-x-1/2 md:bottom-auto md:top-[calc(var(--header-height)+var(--sp-layout))] md:left-[9px] md:translate-x-0 md:fixed md:h-[calc(100vh-4.5rem)] md:overflow-x-visible md:overflow-y-visible md:w-(--sidebar-width) lg:left-[9px] lg:h-[calc(100vh-4.5rem)] lg:overflow-x-visible lg:overflow-y-visible w-auto z-40 transition-[width] duration-300 ease-out',
            isCollapsed ? 'lg:w-(--sidebar-width)' : 'lg:w-64',
          )}
        >
          {navigation}
        </div>
      </Show>
      <main
        className={cn(
          'relative w-full h-full min-h-[calc(100vh-var(--header-height)-var(--sp-layout))] flex-1 md:mb-0 mb-17 lg:px-(--sp-layout) pl-(--sp-layout) md:pr-0! pr-(--sp-layout)',
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
