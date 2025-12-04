'use client';

import useNavigationLayout from './use-navigation-layout';

import images from '@/public/imgs';
import Link from 'next/link';
import { ReactNode } from 'react';
import {
  CalendarIcon,
  FriendsIcon,
  HouseIcon,
  ImageIcon,
} from '@/components/animate-ui/icons/common';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { routes } from '@/utils/routes';
import { usePathname } from 'next/navigation';
import UserProfileCard from '@/components/UserProfileCard';

interface IMenuNavigation {
  title: string;
  href: string;
  icon: ReactNode;
  isActive?: boolean;
}

const menu: IMenuNavigation[] = [
  {
    title: 'navigation.home',
    href: routes.home,
    icon: <HouseIcon className="size-5 text-foreground/70 stroke-[2.5px]" />,
    isActive: true,
  },
  {
    title: 'navigation.friends',
    href: routes.friends,
    icon: <FriendsIcon className="text-foreground/70 size-5 stroke-2" />,
  },
  {
    title: 'navigation.photos',
    href: routes.photos,
    icon: <ImageIcon className="size-5 text-foreground/70 stroke-2" />,
  },
  {
    title: 'navigation.new_feed',
    href: routes.newFeed,
    icon: <CalendarIcon className="size-5 text-foreground/70 stroke-2" />,
  },
];

const NavigationHeader = () => {
  const { userProfile, user } = useNavigationLayout();

  return (
    <div className="dark:bg-gray-800 shadow-[0_0_10px_0_rgba(0,0,0,0.05)] lg:block inline-flex lg:w-full w-auto bg-white p-4 rounded-lg">
      <div className="group lg:flex flex-col inline-flex lg:items-start items-center justify-center gap-2 dark:bg-gray-700 bg-gray-100 rounded-lg lg:p-4 p-0.5 cursor-pointer">
        <UserProfileCard
          username={user?.username || ''}
          avatarUrl={userProfile?.avatarUrl || images.avt1.src}
          fullName={user?.fullName || ''}
          hasRing={false}
          responsive
        />

        <div className="pt-3 text-sm w-full lg:flex hidden gap-2 items-center justify-between">
          <div className="flex flex-col">
            <strong>2.3k</strong>
            <span className="text-xs">Following</span>
          </div>
          <div className="flex flex-col">
            <strong>2.3k</strong>
            <span className="text-xs">Followers</span>
          </div>
          <div className="flex flex-col">
            <strong>80</strong>
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

  const isActive = (href: string) => pathname === href;

  return (
    <div className="dark:bg-gray-800 lg:flex inline-flex flex-col gap-1 items-start justify-center lg:p-4 p-2 shadow-[0_0_10px_0_rgba(0,0,0,0.05)] group lg:w-full w-auto bg-white rounded-lg mt-1">
      {menu.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={cn(
            `flex p-4 rounded-lg lg:w-full w-auto hover:bg-gray-100 dark:hover:bg-gray-900 hover:transition-colors hover:duration-300 items-center justify-start gap-3`,
            isActive(item.href) && 'bg-gray-100 dark:bg-gray-700',
          )}
        >
          <span className={cn(isActive(item.href) ? `[&_svg]:text-primary` : '')}>{item.icon}</span>
          <span
            className={cn(
              'text-sm lg:block hidden text-foreground/70',
              isActive(item.href) ? 'text-primary font-bold' : 'font-medium',
            )}
          >
            {t(item.title)}
          </span>
        </Link>
      ))}
    </div>
  );
};

const NavigationLayout = () => {
  return (
    <div className="lg:w-64 w-auto">
      <div className="h-full flex justify-start items-start flex-col gap-5">
        <NavigationHeader />
        <NavigationMenu />
      </div>
    </div>
  );
};

export default NavigationLayout;
