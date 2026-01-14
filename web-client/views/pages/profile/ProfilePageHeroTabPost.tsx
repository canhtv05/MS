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
    <div className="flex items-center justify-center gap-2">
      {icon}
      <span className="text-[13px] leading-none">{label}</span>
    </div>
  );
};

const ProfilePageHeroTabPost = ({ data }: IProfilePageHeroTabPost) => {
  const { user } = useAuthStore();
  if (user?.auth.username !== data?.userId || !data) return;

  return (
    <>
      <div className=" border-b border-border pb-3 flex gap-3 items-center justify-between">
        <Image
          src={data.avatarUrl}
          alt="Profile Image"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div className="flex-1 w-full">
          <Input
            id="newPassword"
            className="dark:bg-gray-700 bg-gray-100 placeholder:font-medium rounded-lg border-transparent"
            placeholder="Bạn đang nghĩ gì vậy?"
            type="text"
            inputSize="md"
            endIcon={<SmileCircle className="size-5 p-0.5 text-foreground/70" />}
          />
        </div>
        <Button className="h-[40px]">Chia sẻ</Button>
      </div>
      <div className="overflow-x-auto no-scrollbar flex pt-3 justify-between items-center">
        <div className="flex items-center flex-nowrap gap-5 w-max">
          {RICH_CONTENT_MENU.map((item, index) => (
            <RichContent key={index} label={item.label} icon={item.icon} />
          ))}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="" size={'sm'} variant="outline">
              <span className="md:text-sm text-xs">{'layout:header.change_cover'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={-2}>
            <DropdownMenuArrow />
            <DropdownMenuItem>
              <Gallery />
              <span className="md:text-sm text-xs">{'profile:choose_cover_image'}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="md:text-sm text-xs">{'profile:upload_new_cover'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default ProfilePageHeroTabPost;
