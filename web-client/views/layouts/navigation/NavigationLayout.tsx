'use client';

import useNavigationLayout from './use-navigation-layout';
import CustomImage from '@/components/customs/custom-image';

import images from '@/public/imgs';
import Link from 'next/link';
import { ReactNode } from 'react';
import { CalendarDays, House, Image } from 'lucide-react';
import { UserCircleIcon, UserSquareIcon } from '@/public/icons';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { routes } from '@/utils/routes';
import { usePathname } from 'next/navigation';

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
    icon: <House size={20} className="text-foreground/70 stroke-[2.5px]" />,
    isActive: true,
  },
  {
    title: 'navigation.people',
    href: routes.people,
    icon: <UserSquareIcon className="text-foreground/70 size-5 stroke-2" />,
  },
  {
    title: 'navigation.photos',
    href: routes.photos,
    // eslint-disable-next-line jsx-a11y/alt-text
    icon: <Image size={20} className="text-foreground/70 stroke-2" />,
  },
  {
    title: 'navigation.new_feed',
    href: routes.newFeed,
    icon: <CalendarDays size={20} className="text-foreground/70 stroke-2" />,
  },
  {
    title: 'navigation.profile',
    href: routes.profile,
    icon: <UserCircleIcon className="text-foreground/70 size-5 stroke-2" />,
  },
];

const NavigationHeader = () => {
  const { userProfile, user } = useNavigationLayout();

  return (
    <div className="dark:bg-gray-800 w-full bg-white p-4 rounded-md">
      <div className="flex items-center gap-2">
        <CustomImage
          src={userProfile?.avatarUrl || images.avt1.src}
          alt={user?.fullName || ''}
          fallbackSrc={images.avt1.src}
          width={35}
          height={35}
          className="rounded-full"
        />
        <div className="flex flex-col">
          <h3 className="text-[12px] max-w-[150px] font-bold w-full text-foreground truncate">
            {user?.fullName || user?.username}
          </h3>
          <span className="text-[12px] max-w-[150px] w-full text-foreground/70 truncate">
            @{user?.username}
          </span>
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
    <div className="dark:bg-gray-800 py-2 group w-full bg-white rounded-md mt-3">
      {menu.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={cn(
            `flex p-4 relative hover:bg-gray-100 dark:hover:bg-gray-700 hover:transition-colors hover:duration-300 items-center justify-start gap-3`,
            index === menu.length - 1 ? 'border-b-0' : 'border-b',
            isActive(item.href)
              ? "after:bg-blue-500 bg-accent dark:bg-gray-700 after:absolute after:top-1/2 after:-left-[2px] after:w-[4px] after:h-full after:rounded-md after:-translate-y-1/2 after:z-0 after:content-['']"
              : '',
          )}
        >
          <span className={cn(isActive(item.href) ? `[&_svg]:text-blue-500` : '')}>
            {item.icon}
          </span>
          <span
            className={cn(
              'text-sm text-foreground/70',
              isActive(item.href) ? 'text-blue-500 font-bold' : 'font-medium',
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
    <div className="w-64 py-5">
      <div className="h-full flex justify-start items-start flex-col gap-5">
        <NavigationHeader />
        <NavigationMenu />
      </div>
    </div>
  );
};

export default NavigationLayout;
