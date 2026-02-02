'use client';

import { NAV_INTRODUCE_MENU, TNavIntroduceItem } from './TabIntroduce';
import { Skeleton } from '@/components/ui/skeleton';

interface IIntroduceSkeletonProps {
  activeTab: TNavIntroduceItem;
}

const IntroduceSkeleton = ({ activeTab }: IIntroduceSkeletonProps) => {
  const fields = NAV_INTRODUCE_MENU[activeTab] ?? [];

  return (
    <div className="flex flex-col gap-1">
      {fields.map(field => (
        <div
          key={field}
          className="flex items-start gap-3 py-2.5 px-3 -mx-3 rounded-lg border border-transparent"
        >
          <Skeleton className="size-5 rounded-full mt-0.5" />
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default IntroduceSkeleton;
