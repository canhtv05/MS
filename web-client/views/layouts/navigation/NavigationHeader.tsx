'use client';

import useNavigationLayout from './use-navigation-layout';
import images from '@/public/imgs';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import UserProfileCard from '@/components/UserProfileCard';
import { getValidImageSrc } from '@/lib/image-utils';
import useViewport from '@/hooks/use-view-port';
import { Viewport } from '@/enums/common';

const NavigationHeader = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { user } = useNavigationLayout();
  const router = useRouter();
  const { width } = useViewport();

  // Determine avatar size based on viewport
  const getAvatarSize = () => {
    if (width >= Viewport.LG) {
      return isCollapsed ? 40 : 40;
    }
    // MD to LG: reduced avatar to avoid oversized look
    return 40;
  };

  return (
    <div
      className={cn(
        'custom-bg-1 w-full shadow-[0_0_10px_0_rgba(0,0,0,0.07)] flex lg:block rounded-lg',
        'transition-all duration-300 ease-out',
        // MD-LG viewport: more padding for larger avatar
        width < Viewport.LG ? 'p-4' : isCollapsed ? 'p-2 lg:p-2' : 'p-2 lg:p-4',
      )}
    >
      <div
        title={`${user?.profile?.fullname} - @${user?.auth?.username}`}
        onClick={() => router.push(`/user/@${user?.auth?.username}`)}
        className={cn(
          'group lg:flex flex-col flex gap-2 rounded-lg cursor-pointer w-full',
          'transition-all duration-300 ease-out',
          // LG+ collapsed: center, LG+ expanded: start, MD-LG: center
          isCollapsed
            ? 'p-1 bg-transparent my-1 dark:bg-transparent  pl-2'
            : width >= Viewport.LG
              ? 'lg:p-4 p-0.5 lg:dark:bg-gray-700 dark:bg-gray-800 lg:bg-gray-100 justify-start items-start'
              : 'p-2',
        )}
      >
        <UserProfileCard
          username={user?.auth?.username || ''}
          avatarUrl={getValidImageSrc(user?.profile?.avatarUrl, images.avt1.src)}
          fullName={user?.profile?.fullname || ''}
          hasRing={false}
          responsive
          hideInfo={isCollapsed}
          size={getAvatarSize()}
          className={cn(
            'transition-all duration-300 ease-out',
            // When collapsed or MD-LG: center the card
            isCollapsed || width < Viewport.LG ? 'justify-start' : 'justify-start w-full',
          )}
        />

        {/* Stats section with smooth collapse */}
        <div
          className={cn(
            'w-full overflow-hidden transition-all duration-300 ease-out',
            'md:hidden lg:block',
            isCollapsed ? 'max-h-0 opacity-0 hidden!' : 'max-h-[80px] block! opacity-100',
          )}
        >
          <div
            className={cn(
              'w-full transition-all duration-300 ease-out',
              isCollapsed ? 'pt-0' : 'pt-3',
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
