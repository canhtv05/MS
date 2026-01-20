import { ReactNode } from 'react';
import Show from './Show';

interface ILayoutContainerProps {
  children: ReactNode;
  navigation?: ReactNode;
  sidebar?: ReactNode;
}

const LayoutContainer = ({ children, navigation, sidebar }: ILayoutContainerProps) => {
  return (
    <div className="flex relative items-start justify-center bg-[#F9FBFC] pt-14 md:px-[9px] px-0 dark:bg-gray-900 min-h-screen w-full">
      <Show when={!!navigation}>
        <div className="lg:block fixed md:sticky top-18 md:translate-x-0 -translate-x-1/2 md:left-0 left-1/2 md:bottom-auto bottom-0 lg:w-auto w-auto z-40">
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
