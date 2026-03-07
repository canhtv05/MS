'use client';

import { cn } from '@/lib/utils';
import { Activity } from 'react';
import { getValidImageSrc } from '@/lib/image-utils';
import images from '@/public/imgs';
import AvatarStatus from './AvatarStatus';

interface IUserProfileCard {
  username: string;
  avatarUrl: string;
  fullName: string;
  hasRing?: boolean;
  responsive?: boolean;
  hideInfo?: boolean;
  className?: string;
  size?: number;
}

const UserProfileCard = ({
  username,
  avatarUrl,
  fullName,
  hasRing = true,
  responsive = false,
  hideInfo = false,
  className,
  size = 35,
}: IUserProfileCard) => {
  const validAvatarUrl = getValidImageSrc(avatarUrl, images.avt1.src);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <AvatarStatus
        fallback={username}
        src={validAvatarUrl}
        isOnline={true}
        hasRing={hasRing}
        size={size}
      />
      <Activity mode={hideInfo ? 'hidden' : 'visible'}>
        <div className={cn('flex flex-col', responsive ? 'lg:flex hidden' : '')}>
          <h3 className="text-sm max-w-[150px] font-bold w-full text-foreground truncate">
            {fullName}
          </h3>
          <span className="text-xs flex items-center gap-0.5 max-w-[150px] w-full text-foreground/70 truncate">
            @{username}
          </span>
        </div>
      </Activity>
    </div>
  );
};

export default UserProfileCard;
