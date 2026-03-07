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
import { MenuDots } from '@solar-icons/react-perf/Bold';
import { memo } from 'react';
import FriendCardHover from './FriendCardHover';

const FriendCard = () => {
  return (
    <div className="flex items-center justify-between">
      <FriendCardHover />
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
          className="w-[220px] [&_span]:text-foreground/70 shadow-none"
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
