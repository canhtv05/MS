'use client';

import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/auth';
import { IDetailUserProfileDTO } from '@/types/profile';
import { SmileCircle } from '@solar-icons/react-perf/Outline';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { ReactNode } from 'react';
import {
  Gallery,
  LinkMinimalistic2,
  // VideocameraRecord,
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
import AvatarStatus from '@/components/AvatarStatus';
import { useTranslation } from 'react-i18next';
import Wrapper from '@/components/ui/wrapper';
import { getValidImageSrc } from '@/lib/image-utils';
import images from '@/public/imgs';

interface IHeroTabPost {
  data?: IDetailUserProfileDTO;
}

interface IRichContent {
  label: string;
  icon: ReactNode;
}

const RichContentButton = ({ label, icon }: IRichContent) => {
  return (
    <button className="flex shrink-0 items-center justify-center gap-1 whitespace-nowrap cursor-pointer">
      <span className="size-5 p-px text-foreground/70 leading-none">{icon}</span>
      <span className="text-[13px] leading-none font-medium text-foreground/80">{label}</span>
    </button>
  );
};

const HeroTabPost = ({ data }: IHeroTabPost) => {
  const { user } = useAuthStore();
  const { t } = useTranslation('profile');

  const RICH_CONTENT_MENU: IRichContent[] = [
    {
      label: t('image_video'),
      icon: <Gallery className="size-[18px] p-px text-blue-500" />,
    },
    {
      label: t('attachment'),
      icon: <LinkMinimalistic2 className="size-[18px] p-px text-orange-500" />,
    },
    // {
    //   label: 'Live',
    //   icon: <VideocameraRecord className="size-[18px] p-px text-red-500" />,
    // },
    {
      label: t('hashtag'),
      icon: <Hashtag className="size-[18px] p-px text-green-500" />,
    },
    {
      label: t('mention'),
      icon: <MentionCircle className="size-[18px] p-px text-foreground" />,
    },
  ];

  if (user?.auth.username !== data?.userId || !data) return;

  return (
    <Wrapper>
      <div className="border-b group-hover:border-border border-border pb-3 flex gap-3 items-center justify-between">
        <AvatarStatus
          fallback={data.fullname}
          src={getValidImageSrc(data.avatarUrl, images.avt1.src)}
          isOnline={true}
          hasAnimation={true}
          size={42}
          hasRing={false}
        />
        <div className="flex-1 min-w-0">
          <Input
            id="post-input"
            className="dark:bg-gray-700 bg-gray-100 placeholder:font-medium rounded-md border-transparent w-full"
            placeholder={t('thinking_placeholder')}
            type="text"
            inputSize="md"
            endIcon={<SmileCircle className="size-5 p-0.5 text-foreground/70" />}
          />
        </div>
        <Button className="h-10 shrink-0 px-6">{t('share')}</Button>
      </div>

      <div className="flex w-full items-center gap-6 pt-3 pb-1">
        <div className="flex-1 min-w-0 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-4 flex-nowrap">
            {RICH_CONTENT_MENU.map((item, index) => (
              <RichContentButton key={index} {...item} />
            ))}
          </div>
        </div>

        <div className="shrink-0">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="h-8 whitespace-nowrap shadow-none border-foreground/10"
              >
                <span className="text-xs font-semibold">{t('public')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={2}>
              <DropdownMenuArrow />
              <DropdownMenuItem className="gap-2">
                <Gallery className="size-4" />
                <span className="text-sm">{t('choose_from_gallery')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <span className="text-sm">{t('only_me')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Wrapper>
  );
};

export default HeroTabPost;
