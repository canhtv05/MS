'use client';

import useNavigationLayout from './use-navigation-layout';

import images from '@/public/imgs';
import Link from 'next/link';
import { ReactNode, useState, useEffect } from 'react';
import {
  CalendarIcon,
  FriendsIcon,
  HouseIcon,
  ImageIcon,
} from '@/components/animate-ui/icons/common';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import UserProfileCard from '@/components/UserProfileCard';
import {
  TooltipPanel,
  TooltipTrigger,
  Tooltip,
} from '@/components/animate-ui/components/base/tooltip';
import useViewport from '@/hooks/use-view-port';
import { Viewport } from '@/enums/common';
import { APP_CONFIGS } from '@/configs';

interface IMenuNavigation {
  title: string;
  href: string;
  icon: ReactNode;
  isActive?: boolean;
}

const menu: IMenuNavigation[] = [
  {
    title: 'navigation.home',
    href: APP_CONFIGS.ROUTES.home,
    icon: <HouseIcon className="size-5 text-foreground/70 stroke-[2.5px]" />,
    isActive: true,
  },
  {
    title: 'navigation.friends',
    href: APP_CONFIGS.ROUTES.friends,
    icon: <FriendsIcon className="text-foreground/70 size-5 stroke-2" />,
  },
  {
    title: 'navigation.photos',
    href: APP_CONFIGS.ROUTES.photos,
    icon: <ImageIcon className="size-5 text-foreground/70 stroke-2" />,
  },
  {
    title: 'navigation.new_feed',
    href: APP_CONFIGS.ROUTES.newFeed,
    icon: <CalendarIcon className="size-5 text-foreground/70 stroke-2" />,
  },
];

const NavigationHeader = () => {
  const { userProfile, user } = useNavigationLayout();
  const router = useRouter();

  return (
    <div className="dark:bg-gray-800 shadow-[0_0_10px_0_rgba(0,0,0,0.07)] lg:block inline-flex lg:w-full w-auto bg-white p-4 rounded-lg">
      <div
        onClick={() => router.push(`/@${user?.username}`)}
        className="group lg:flex flex-col inline-flex lg:items-start items-center justify-center gap-2 lg:dark:bg-gray-700 dark:bg-gray-800 bg-gray-100 rounded-lg lg:p-4 p-0.5 cursor-pointer"
      >
        <UserProfileCard
          username={user?.username || ''}
          avatarUrl={userProfile?.avatarUrl || images.avt1.src}
          fullName={user?.fullName || ''}
          hasRing={false}
          responsive
        />

        <div className="pt-3 text-sm w-full lg:flex hidden gap-2 items-center justify-between">
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
    </div>
  );
};

const NavigationMenu = () => {
  const { t } = useTranslation('navigation');
  const pathname = usePathname();
  const [tooltipSide, setTooltipSide] = useState<'top' | 'right' | null>(null);
  const { width } = useViewport();

  const isActive = (href: string) => pathname === href;

  useEffect(() => {
    const updateTooltipSide = () => {
      if (width >= Viewport.LG) {
        setTooltipSide(null);
      } else if (width >= Viewport.MD) {
        setTooltipSide('right');
      } else {
        setTooltipSide('top');
      }
    };
    updateTooltipSide();
  }, [width]);

  return (
    <div className="lg:flex inline-flex md:flex-col flex-row gap-1 items-start justify-center group w-full rounded-lg md:mt-0 mt-0 md:mb-0 mb-2">
      <div className="w-auto dark:bg-gray-800 bg-white lg:w-full lg:flex shadow-[0_0_10px_0_rgba(0,0,0,0.07)] inline-flex md:flex-col flex-row md:p-3 p-2 gap-1 items-start justify-center rounded-lg">
        {menu.map((item, index) => {
          const linkContent = (
            <>
              <span className={cn(isActive(item.href) ? `[&_svg]:text-primary` : '')}>
                {item.icon}
              </span>
              <span
                className={cn(
                  'text-sm lg:block hidden text-foreground/70',
                  isActive(item.href) ? 'text-primary font-black' : 'font-bold',
                )}
              >
                {t(item.title)}
              </span>
            </>
          );

          if (tooltipSide === null) {
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  `flex lg:p-4 p-3 rounded-lg lg:w-full w-auto hover:bg-gray-100 dark:hover:bg-gray-900 items-center justify-start gap-3`,
                  isActive(item.href) && 'bg-gray-100 dark:bg-gray-700',
                )}
              >
                {linkContent}
              </Link>
            );
          }

          return (
            <Tooltip key={index}>
              <TooltipTrigger
                className={cn(
                  `flex lg:p-4 p-3 rounded-lg lg:w-full w-auto hover:bg-gray-100 dark:hover:bg-gray-900 items-center justify-start gap-3`,
                  isActive(item.href) && 'bg-gray-100 dark:bg-gray-700',
                )}
              >
                <Link href={item.href} className="flex items-center gap-3">
                  {linkContent}
                </Link>
              </TooltipTrigger>
              <TooltipPanel
                side={tooltipSide}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <span className="text-white/70">{t(item.title)}</span>
              </TooltipPanel>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

const NavigationLayout = () => {
  return (
    <div className="lg:w-64 w-auto">
      <div className="h-full flex md:flex-col flex-row md:justify-start justify-center items-start lg:gap-7 gap-4 w-full">
        <div className="md:block hidden w-full">
          <NavigationHeader />
        </div>
        <div className="md:order-2 order-1 w-full">
          <NavigationMenu />
        </div>
      </div>
    </div>
  );
};

export default NavigationLayout;
