'use client';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/animate-ui/components/radix/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, normalizeWebsiteUrl } from '@/lib/utils';
import { getValidImageSrc } from '@/lib/image-utils';
import images from '@/public/imgs';
import { memo, useState } from 'react';
import { useUserProfileStore } from '@/stores/profile';
import { IUserProfileIntroduceDTO } from '@/types/profile';
import { Link as LinkIcon } from '@solar-icons/react-perf/BoldDuotone';
import { MenuDots } from '@solar-icons/react-perf/Bold';
import {
  GithubIcon,
  FaceBookBoldDuotoneIcon,
  LinkedinBoldDuotoneIcon,
  InstagramTwoOneIcon,
  TiktokIcon,
  XTwitterIcon,
} from '@/components/animate-ui/icons';
import Link from 'next/link';
import { MOCK_POSTS } from '../TabPost';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { User } from '@solar-icons/react-perf/category/style/Linear';
import { Letter } from '@solar-icons/react-perf/category/style/Outline';
import { IconButton } from '@/components/animate-ui/components/buttons/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu';

interface SocialMediaItem {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  key: string;
  label: string;
  displayName: string;
}

const extractUsernameFromUrl = (url: string, key: string): string => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Remove leading and trailing slashes
    const path = pathname.replace(/^\/+|\/+$/g, '');

    if (!path) return url;

    // Handle specific platforms
    switch (key) {
      case 'linkedinUrl':
        // LinkedIn: /in/username or /company/username
        const linkedinMatch = path.match(/\/(?:in|company)\/(.+)/);
        return linkedinMatch ? linkedinMatch[1] : path.split('/').pop() || url;

      case 'tiktokUrl':
        // TikTok: /@username or /username
        return path.replace(/^@/, '');

      case 'xUrl':
        // X/Twitter: /username
        return path;

      case 'facebookUrl':
        // Facebook: /username or /profile.php?id=...
        if (path.includes('profile.php')) {
          const idMatch = urlObj.searchParams.get('id');
          return idMatch || path;
        }
        return path;

      case 'githubUrl':
        // GitHub: /username or /username/repo
        return path.split('/')[0];

      case 'instagramUrl':
        // Instagram: /username
        return path;

      default:
        // For websiteUrl or unknown, return the domain or last path segment
        return path.split('/').pop() || urlObj.hostname;
    }
  } catch {
    // If URL parsing fails, try to extract from string
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?[^\/]+\/(.+)/);
    return match ? match[1].replace(/\/$/, '') : url;
  }
};

const fillSocialMediaUrl = (url: IUserProfileIntroduceDTO): SocialMediaItem[] => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    websiteUrl: LinkIcon,
    githubUrl: GithubIcon,
    linkedinUrl: LinkedinBoldDuotoneIcon,
    instagramUrl: InstagramTwoOneIcon,
    tiktokUrl: TiktokIcon,
    xUrl: XTwitterIcon,
    facebookUrl: FaceBookBoldDuotoneIcon,
  };

  const labelMap: Record<string, string> = {
    websiteUrl: 'Website',
    githubUrl: 'GitHub',
    linkedinUrl: 'LinkedIn',
    instagramUrl: 'Instagram',
    tiktokUrl: 'TikTok',
    xUrl: 'X (Twitter)',
    facebookUrl: 'Facebook',
  };

  return Object.entries(url)
    .filter(([key, value]) => {
      const socialMediaKeys = [
        'websiteUrl',
        'githubUrl',
        'linkedinUrl',
        'instagramUrl',
        'tiktokUrl',
        'xUrl',
        'facebookUrl',
      ];
      return socialMediaKeys.includes(key) && value !== null && value !== undefined && value !== '';
    })
    .map(([key, value]) => {
      const normalizedUrl = normalizeWebsiteUrl(value as string);
      const displayName = extractUsernameFromUrl(normalizedUrl, key);
      return {
        icon: iconMap[key] || LinkIcon,
        value: normalizedUrl,
        key,
        label: labelMap[key] || 'Link',
        displayName,
      };
    });
};

const FriendCardAvatar = ({
  validAvatarUrl,
  username,
  size = 'md',
}: {
  validAvatarUrl: string;
  username: string;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const sizeClasses = {
    sm: 'size-10',
    md: 'size-12',
    lg: 'size-16 md:size-20',
  };

  return (
    <Avatar className={cn('relative', sizeClasses[size])}>
      <AvatarImage
        className={cn('rounded-full cursor-pointer')}
        src={validAvatarUrl}
        alt="avatar"
      />
      <AvatarFallback className="text-sm font-semibold">
        {username.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

const SocialMediaButton = ({ icon: Icon, value, label, displayName }: SocialMediaItem) => {
  return (
    <Link
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group flex items-center gap-1 px-2 py-1 rounded-full',
        'border border-border/60 custom-bg-2',
      )}
      title={label}
    >
      <Icon className="size-3 shrink-0 transition-colors duration-300 text-muted-foreground group-hover:text-foreground" />
      <span className="text-[11px] transition-colors duration-300 text-muted-foreground group-hover:text-foreground truncate">
        {displayName}
      </span>
    </Link>
  );
};

const FriendCardHover = () => {
  const [open, setOpen] = useState(false);
  const { user } = useUserProfileStore();
  const validAvatarUrl = getValidImageSrc(user?.avatarUrl, images.avt1.src);
  const socialLinks = user?.introduce ? fillSocialMediaUrl(user.introduce) : [];
  const displayName = user?.fullname || 'Người dùng';
  const handle = user?.userId ? `@${user.userId}` : '';
  const subtitle = user?.introduce?.jobTitle || user?.bio || user?.introduce?.company || '';

  return (
    <div className={cn('flex items-center gap-4')}>
      <HoverCard openDelay={100} closeDelay={200} open={open} onOpenChange={setOpen}>
        <HoverCardTrigger asChild>
          <div className="cursor-pointer" onClick={() => setOpen(prev => !prev)}>
            <FriendCardAvatar
              validAvatarUrl={validAvatarUrl}
              username={user?.fullname || 'Người dùng'}
              size="md"
            />
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          className="border-border w-80 p-0 shadow-none"
          sideOffset={12}
          align="start"
          side="top"
          transition={{ type: 'keyframes', duration: 0.25, ease: 'easeInOut' }}
        >
          <div className="flex items-start gap-3 p-3 pb-2 border-b border-border/60">
            <FriendCardAvatar
              validAvatarUrl={validAvatarUrl}
              username={user?.fullname || 'Người dùng'}
              size="lg"
            />
            <div className="flex flex-col flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground truncate">{displayName}</h3>
              {(handle || subtitle) && (
                <div className="text-xs text-foreground/70 leading-normal min-h-[3lh]">
                  {handle && <div className="wrap-break-word">{handle}</div>}
                  {subtitle && <div className="wrap-break-word mt-0.5">{subtitle}</div>}
                </div>
              )}
            </div>
          </div>

          {socialLinks.length > 0 && (
            <div className="p-3 pt-2">
              <div className="flex flex-wrap gap-1">
                {socialLinks.map(social => (
                  <SocialMediaButton
                    key={social.key}
                    icon={social.icon}
                    value={social.value}
                    label={social.label}
                    displayName={social.displayName}
                  />
                ))}
              </div>
            </div>
          )}
          <div className="w-full p-3">
            <div className="text-sm w-full text-center flex gap-10 items-center justify-center">
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
          {(() => {
            const allImages = MOCK_POSTS.slice(0, 3)
              .flatMap(post => post.images || [])
              .slice(0, 3);

            if (allImages.length === 0) return null;

            return (
              <div className="grid grid-cols-3 gap-0.5 p-3 pt-2">
                {allImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden cursor-pointer transition-all duration-300 hover:opacity-90"
                  >
                    <Image
                      src={image}
                      alt={`Post image ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 33vw, 25vw"
                      unoptimized
                      loading="eager"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            );
          })()}
          <div className="flex px-3 pb-3 gap-2 justify-between items-center [&>button]:cursor-pointer">
            <Button variant="outline" className="shadow-none flex-1">
              <User className="size-4" />
              <span className="text-xs">Bạn bè</span>
            </Button>
            <Button variant="default" className="shadow-none flex-1 text-white">
              <Letter className="size-4" />
              <span className="text-xs">Nhắn tin</span>
            </Button>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <div className="relative cursor-pointer">
                  <IconButton variant="default">
                    <MenuDots />
                  </IconButton>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                sideOffset={4}
                side="top"
                align="end"
                className="w-[220px] [&_span]:text-foreground/70 shadow-none"
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem>Ẩn bớt bài viết từ người này</DropdownMenuItem>
                  <DropdownMenuItem variant="destructive">Chặn</DropdownMenuItem>
                  <DropdownMenuItem variant="destructive">Báo cáo</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </HoverCardContent>
      </HoverCard>

      <div className={cn('flex flex-col')}>
        <h3 className="text-sm max-w-[200px] font-bold w-full text-foreground truncate">
          {displayName}
        </h3>
        {handle && (
          <span className="text-[11px] max-w-[200px] w-full text-foreground/70 truncate">
            {handle}
          </span>
        )}
        {subtitle && (
          <span className="text-[11px] max-w-[200px] w-full text-muted-foreground truncate">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default memo(FriendCardHover);
