'use client';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './customs/avatar';
import Ring from './customs/ring';

interface IUserCard {
  name: string;
  avatar: string;
  isOnline?: boolean;
}

const UserCard = ({ name, avatar, isOnline = true }: IUserCard) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Avatar>
          <AvatarImage
            width={35}
            height={35}
            className="rounded-full cursor-pointer"
            src={avatar}
            alt={name}
          />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="absolute z-50 -bottom-0.5 -right-1 pointer-events-none">
          <Ring
            className="dark:border-gray-800 border-white border-2"
            isOnline={isOnline}
            hasAnimation={false}
          />
        </div>
      </div>

      <div className={cn('flex flex-col')}>
        <h3 className="text-sm font-bold w-full text-foreground truncate">{name}</h3>
      </div>
    </div>
  );
};

export default UserCard;
