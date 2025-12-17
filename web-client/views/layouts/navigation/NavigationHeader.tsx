'use client';

import useNavigationLayout from './use-navigation-layout';
import images from '@/public/imgs';
import { Activity } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import UserProfileCard from '@/components/UserProfileCard';

const NavigationHeader = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { userProfile, user } = useNavigationLayout();
  const router = useRouter();

  return (
    <div className="dark:bg-gray-800 p-4 w-full shadow-[0_0_10px_0_rgba(0,0,0,0.07)] lg:block inline-flex bg-white rounded-lg">
      <div
        onClick={() => router.push(`/@${user?.username}`)}
        className={cn(
          'group lg:flex flex-col flex lg:items-start items-center justify-center gap-2 rounded-lg cursor-pointer transition-[padding] duration-300 ease-out w-full',
          isCollapsed
            ? 'p-1 bg-transparent dark:bg-transparent h-full'
            : 'lg:p-4 p-0.5 lg:dark:bg-gray-700 dark:bg-gray-800 bg-gray-100',
        )}
      >
        <UserProfileCard
          username={user?.username || ''}
          avatarUrl={userProfile?.avatarUrl || images.avt1.src}
          fullName={user?.fullName || ''}
          hasRing={false}
          responsive
          hideInfo={isCollapsed}
          className={cn(isCollapsed && 'justify-end')}
        />

        <Activity mode={isCollapsed ? 'hidden' : 'visible'}>
          <div
            className={cn(
              'overflow-hidden w-full',
              isCollapsed ? 'max-h-0 pt-0' : 'max-h-[60px] pt-3',
            )}
          >
            <div className="text-sm w-full lg:flex hidden gap-2 items-center justify-between">
              <div className="flex flex-col">
                <strong className="font-bold">2.3k</strong>
                <span className="text-xs">Following</span>
              </div>
              <div className="flex flex-col">
                <strong className="font-bold">2.3k</strong>
                <span className="text-xs">Followers</span>
              </div>
              <div className="flex flex-col">
                <strong className="font-bold">80</strong>
                <span className="text-xs">Posts</span>
              </div>
            </div>
          </div>
        </Activity>
      </div>
    </div>
  );
};

export default NavigationHeader;
