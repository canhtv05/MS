'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Heart, ChatRound, Share, MenuDots } from '@solar-icons/react-perf/Outline';
import { Heart as HeartFilled } from '@solar-icons/react-perf/Bold';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuArrow,
} from '@/components/animate-ui/components/radix/dropdown-menu';
import AvatarStatus from '@/components/AvatarStatus';

export interface IFeedPost {
  id: string;
  author: {
    name: string;
    avatarUrl: string;
    username: string;
  };
  content: string;
  images?: string[];
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
}

interface IFeedPostCard {
  post: IFeedPost;
}

export const FeedPostCard = ({ post }: IFeedPostCard) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <div className="group relative w-full overflow-hidden rounded-md border border-border/50 backdrop-blur-xl group-hover:border-border">
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <AvatarStatus
              fallback={post.author.name}
              src={post.author.avatarUrl}
              isOnline={true}
              hasAnimation={true}
              size={45}
              hasRing={false}
            />
            <div className="flex flex-col">
              <h3 className="text-sm font-semibold text-foreground hover:underline cursor-pointer">
                {post.author.name}
              </h3>
              <p className="text-xs text-muted-foreground">{post.timestamp}</p>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground cursor-pointer">
              <MenuDots className="size-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8}>
            <DropdownMenuArrow />
            <DropdownMenuItem>Lưu bài viết</DropdownMenuItem>
            <DropdownMenuItem>Ẩn bài viết</DropdownMenuItem>
            <DropdownMenuItem>Báo cáo</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">Chặn</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {post.content && (
        <div className="px-4 pb-3">
          <p className="text-sm leading-relaxed text-foreground/90">{post.content}</p>
        </div>
      )}

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div
          className={`relative w-full ${
            post.images.length === 1
              ? 'aspect-16/10'
              : post.images.length === 2
                ? 'grid grid-cols-2 gap-1'
                : 'grid grid-cols-2 gap-1'
          }`}
        >
          {post.images.slice(0, 4).map((image, index) => (
            <div
              key={index}
              className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:opacity-90 ${
                post.images?.length === 1
                  ? 'aspect-16/10 w-full'
                  : post.images?.length === 3 && index === 0
                    ? 'col-span-2 aspect-video'
                    : 'aspect-square'
              }`}
            >
              <Image src={image} alt={`Post image ${index + 1}`} fill className="object-cover" />
              {post.images && post.images.length > 4 && index === 3 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                  <span className="text-3xl font-bold text-white">+{post.images.length - 4}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1">
            <div className="flex size-5 items-center justify-center rounded-full bg-linear-to-tr from-purple-500 to-pink-500">
              <HeartFilled className="size-3 text-white" />
            </div>
          </div>
          <span className="text-xs font-medium">{likesCount} Thích</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <button className="transition-colors hover:text-foreground cursor-pointer">
            {post.comments} Bình luận
          </button>
          <button className="transition-colors hover:text-foreground cursor-pointer">
            {post.shares} Chia sẻ
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-border/50 px-2 py-1.5">
        <div className="flex items-center justify-around gap-1">
          <button
            onClick={handleLike}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-accent cursor-pointer ${
              isLiked ? 'text-pink-500' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isLiked ? <HeartFilled className="size-5" /> : <Heart className="size-5" />}
            <span>Thích</span>
          </button>

          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground cursor-pointer">
            <ChatRound className="size-5" />
            <span>Bình luận</span>
          </button>

          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground cursor-pointer">
            <Share className="size-5" />
            <span>Chia sẻ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
