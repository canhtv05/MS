'use client';

import { IconButton } from '@/components/animate-ui/components/buttons/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/animate-ui/components/radix/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getValidImageSrc } from '@/lib/image-utils';
import { cn } from '@/lib/utils';
import images from '@/public/imgs';
import { MenuDots } from '@solar-icons/react-perf/Bold';
import { memo, useState } from 'react';

const FriendCard = () => {
  const [open, setOpen] = useState(false);
  const validAvatarUrl = getValidImageSrc(null, images.avt1.src);
  const username = 'test';

  return (
    <div className="flex items-center justify-between">
      <div className={cn('flex items-center gap-2')}>
        <HoverCard openDelay={100} closeDelay={50} open={open} onOpenChange={setOpen}>
          <HoverCardTrigger asChild>
            <div className="relative">
              <Avatar className="relative md:size-18 size-12">
                <AvatarImage
                  className={cn('rounded-full cursor-pointer')}
                  src={validAvatarUrl}
                  alt="avatar"
                />
                <AvatarFallback>{username.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </HoverCardTrigger>
          <HoverCardContent
            className="border-border w-xs"
            sideOffset={20}
            align="start"
            transition={{ type: 'keyframes', duration: 0.25, ease: 'easeInOut' }}
          >
            <Avatar className="relative md:size-18 size-12">
              <AvatarImage
                className={cn('rounded-full cursor-pointer')}
                src={validAvatarUrl}
                alt="avatar"
              />
              <AvatarFallback>{username.charAt(0)}</AvatarFallback>
            </Avatar>
          </HoverCardContent>
        </HoverCard>
        <div className={cn('flex flex-col gap-1')}>
          <h3 className="text-sm max-w-[200px] font-bold w-full text-foreground truncate">
            Test User
          </h3>
          <span className="text-xs flex items-center gap-0.5 max-w-[200px] w-full text-foreground/70 truncate">
            @{username}
          </span>
        </div>
      </div>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <div className="relative cursor-pointer">
            <IconButton variant="ghost">
              <MenuDots className="size-[16px]" />
            </IconButton>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          sideOffset={4}
          side="bottom"
          align="end"
          className="w-[220px] z-120! [&_span]:text-foreground/70"
        >
          <DropdownMenuGroup>
            <DropdownMenuItem>Xem trang cá nhân</DropdownMenuItem>
            <DropdownMenuItem>Nhắn tin</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Ẩn bớt bài viết từ người này</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">Xóa bạn bè</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">Chặn</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">Báo cáo</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default memo(FriendCard);
