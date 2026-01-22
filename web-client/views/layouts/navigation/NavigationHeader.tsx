'use client';

import useNavigationLayout from './use-navigation-layout';
import images from '@/public/imgs';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import UserProfileCard from '@/components/UserProfileCard';
import { getValidImageSrc } from '@/lib/image-utils';
import { startTransition, useEffect, useState } from 'react';

const NavigationHeader = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { user } = useNavigationLayout();
  const router = useRouter();
  const [alignCenter, setAlignCenter] = useState(false);

  useEffect(() => {
    if (!isCollapsed) {
      startTransition(() => {
        setAlignCenter(false);
      });
      return;
    }

    startTransition(() => {
      setAlignCenter(false);
    });
    const timeoutId = window.setTimeout(() => {
      startTransition(() => {
        setAlignCenter(true);
      });
    }, 300);
    return () => window.clearTimeout(timeoutId);
  }, [isCollapsed]);

  return (
    <div
      className={cn(
        'custom-bg-1 p-2 lg:p-4 w-full shadow-[0_0_10px_0_rgba(0,0,0,0.07)] flex lg:block rounded-lg',
        isCollapsed && 'md:h-[72px] md:items-center md:justify-center',
      )}
    >
      <div
        title={`${user?.profile?.fullname} - @${user?.auth?.username}`}
        onClick={() => router.push(`/user/@${user?.auth?.username}`)}
        className={cn(
          'group lg:flex flex-col flex lg:items-start items-center justify-center gap-2 rounded-lg cursor-pointer transition-[padding] duration-300 ease-out w-full',
          isCollapsed
            ? 'p-1 bg-transparent dark:bg-transparent h-full'
            : 'lg:p-4 p-0.5 lg:dark:bg-gray-700 dark:bg-gray-800 lg:bg-gray-100',
        )}
      >
        <UserProfileCard
          username={user?.auth?.username || ''}
          avatarUrl={getValidImageSrc(user?.profile?.avatarUrl, images.avt1.src)}
          fullName={user?.profile?.fullname || ''}
          hasRing={false}
          responsive
          hideInfo={isCollapsed}
          className={cn(
            isCollapsed ? (alignCenter ? 'justify-center' : 'justify-start') : 'justify-start',
            'w-full',
          )}
        />

        <div className={cn(isCollapsed ? 'hidden' : 'md:hidden lg:block', 'w-full')}>
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
        </div>
      </div>
    </div>
  );
};

export default NavigationHeader;
