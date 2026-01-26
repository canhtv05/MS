'use client';

import useNavigationLayout from './use-navigation-layout';
import images from '@/public/imgs';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import UserProfileCard from '@/components/UserProfileCard';
import { getValidImageSrc } from '@/lib/image-utils';

const NavigationHeader = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { user } = useNavigationLayout();
  const router = useRouter();

  const avatarSize = 40;

  return (
    <div
      className={cn(
        'custom-bg-1 w-full shadow-[0_0_10px_0_rgba(0,0,0,0.07)] block rounded-lg',
        'transition-all duration-300 ease-out',
        isCollapsed ? 'p-2' : 'p-2 lg:p-4',
      )}
    >
      <div
        title={`${user?.profile?.fullname} - @${user?.auth?.username}`}
        onClick={() => router.replace(`/user/@${user?.auth?.username}`)}
        className={cn(
          'group flex flex-col gap-2 rounded-lg cursor-pointer w-full',
          'transition-all duration-300 ease-out',
          isCollapsed
            ? 'p-1 bg-transparent my-1 dark:bg-transparent pl-2'
            : 'p-4 dark:bg-gray-700 bg-gray-100 justify-start items-start',
        )}
      >
        <UserProfileCard
          username={user?.auth?.username || ''}
          avatarUrl={getValidImageSrc(user?.profile?.avatarUrl, images.avt1.src)}
          fullName={user?.profile?.fullname || ''}
          hasRing={false}
          responsive
          hideInfo={isCollapsed}
          size={avatarSize}
          className={cn('transition-all duration-300 ease-out', 'justify-start w-full')}
        />

        <div
          className={cn(
            'w-full overflow-hidden transition-all duration-300 ease-out',
            isCollapsed ? 'max-h-0 opacity-0 hidden!' : 'max-h-[80px] block! opacity-100',
          )}
        >
          <div
            className={cn(
              'w-full transition-all duration-300 ease-out',
              isCollapsed ? 'pt-0' : 'pt-3',
            )}
          >
            <div className="text-sm w-full flex gap-2 items-center justify-between">
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
