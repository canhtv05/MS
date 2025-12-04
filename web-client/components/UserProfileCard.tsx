'use client';

import { cn } from '@/lib/utils';
import { AtSignIcon } from './animate-ui/icons/at-sign';
import { Avatar, AvatarFallback, AvatarImage } from './customs/avatar';
import Ring from './customs/ring';

interface IUserProfileCard {
  username: string;
  avatarUrl: string;
  fullName: string;
  hasRing?: boolean;
  responsive?: boolean;
}

const UserProfileCard = ({
  username,
  avatarUrl,
  fullName,
  hasRing = true,
  responsive = false,
}: IUserProfileCard) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Avatar className="relative">
          <AvatarImage
            width={35}
            height={35}
            className="rounded-full border-2 border-purple-300 cursor-pointer"
            src={avatarUrl}
            alt={username}
          />
          <AvatarFallback>{username.charAt(0)}</AvatarFallback>
        </Avatar>
        {hasRing && (
          <div className="absolute z-50 -bottom-0.5 -right-1 pointer-events-none">
            <Ring className="border-card border-2" />
          </div>
        )}
      </div>

      <div className={cn('flex flex-col', responsive ? 'lg:flex hidden' : '')}>
        <h3 className="text-sm max-w-[150px] font-bold w-full text-foreground truncate">
          {fullName}
        </h3>
        <span className="text-xs flex items-center gap-0.5 max-w-[150px] w-full text-foreground/70 truncate">
          <AtSignIcon size={12} className="group-hover:animate-icon" />
          {username}
        </span>
      </div>
    </div>
  );
};

export default UserProfileCard;
