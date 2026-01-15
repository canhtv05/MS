'use client';

import { Input } from '@/components/customs/input';
import { useAuthStore } from '@/stores/auth';
import { IDetailUserProfileDTO } from '@/types/profile';
import Image from 'next/image';
import { SmileCircle } from '@solar-icons/react-perf/Outline';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { ReactNode } from 'react';
import {
  Gallery,
  LinkMinimalistic2,
  VideocameraRecord,
  Hashtag,
  MentionCircle,
} from '@solar-icons/react-perf/Outline';
import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu';

interface IProfilePageHeroTabPost {
  data?: IDetailUserProfileDTO;
}

interface IRichContent {
  label: string;
  icon: ReactNode;
}

const RICH_CONTENT_MENU: IRichContent[] = [
  {
    label: 'Image/Video',
    icon: <Gallery className="size-[18px] p-px text-blue-500" />,
  },
  {
    label: 'Attachment',
    icon: <LinkMinimalistic2 className="size-[18px] p-px text-orange-500" />,
  },
  {
    label: 'Live',
    icon: <VideocameraRecord className="size-[18px] p-px text-red-500" />,
  },
  {
    label: 'Hashtag',
    icon: <Hashtag className="size-[18px] p-px text-green-500" />,
  },
  {
    label: 'Mention',
    icon: <MentionCircle className="size-[18px] p-px text-foreground" />,
  },
];

const RichContent = ({ label, icon }: IRichContent) => {
  return (
    <div className="flex shrink-0 items-center justify-center gap-1 whitespace-nowrap">
      {icon}
      <span className="text-[13px] leading-none font-medium text-foreground/80">{label}</span>
    </div>
  );
};

const ProfilePageHeroTabPost = ({ data }: IProfilePageHeroTabPost) => {
  const { user } = useAuthStore();
  if (user?.auth.username !== data?.userId || !data) return;

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <div className="border-b border-border pb-3 flex gap-3 items-center justify-between">
        <Image
          src={data.avatarUrl}
          alt="Profile Image"
          width={40}
          height={40}
          className="size-10 rounded-full object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <Input
            id="post-input"
            className="dark:bg-gray-700 bg-gray-100 placeholder:font-medium rounded-lg border-transparent w-full"
            placeholder="Bạn đang nghĩ gì vậy?"
            type="text"
            inputSize="md"
            endIcon={<SmileCircle className="size-5 p-0.5 text-foreground/70" />}
          />
        </div>
        <Button className="h-10 shrink-0 px-6">Chia sẻ</Button>
      </div>

      <div className="no-scrollbar flex w-full items-center justify-between gap-6 overflow-x-auto pt-3 pb-1 flex-nowrap">
        <div className="flex items-center flex-nowrap gap-4 shrink-0">
          {RICH_CONTENT_MENU.map((item, index) => (
            <RichContent key={index} label={item.label} icon={item.icon} />
          ))}
        </div>

        <div className="shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="h-8 whitespace-nowrap shadow-none border-foreground/10"
              >
                <span className="text-xs font-semibold">Công khai</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8}>
              <DropdownMenuArrow />
              <DropdownMenuItem className="gap-2">
                <Gallery className="size-4" />
                <span className="text-sm">Chọn từ thư viện</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <span className="text-sm">Chỉ mình tôi</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageHeroTabPost;
