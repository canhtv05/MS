'use client';

import useNavigationLayout from './use-navigation-layout';
import CustomImage from '@/components/customs/custom-image';
import { HomeIcon } from '@/components/ui/home';

import images from '@/public/imgs';
import Link from 'next/link';
import { ReactNode } from 'react';

interface IMenuNavigation {
  title: string;
  href: string;
  icon: ReactNode;
}

const menu: IMenuNavigation[] = [
  {
    title: 'Home',
    href: '/home',
    icon: <HomeIcon size={25} className="text-foreground/70" />,
  },
  {
    title: 'Home',
    href: '/home',
    icon: <HomeIcon size={25} className="text-foreground/70" />,
  },
  {
    title: 'Home',
    href: '/home',
    icon: <HomeIcon size={25} className="text-foreground/70" />,
  },
  {
    title: 'Home',
    href: '/home',
    icon: <HomeIcon size={25} className="text-foreground/70" />,
  },
];

const NavigationHeader = () => {
  const { userProfile, user } = useNavigationLayout();

  return (
    <div className="dark:bg-gray-800 w-full bg-white p-3 rounded-md">
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
  return (
    <div className="dark:bg-gray-800 group w-full bg-white rounded-md mt-3">
      <div className="group-hover:animate-icon">
        {menu.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`flex p-5 items-center justify-start gap-5 ${index === menu.length - 1 ? 'border-b-0' : 'border-b'}`}
          >
            {item.icon}
            <span className="text-sm text-foreground/70 font-bold">{item.title}</span>
          </Link>
        ))}
      </div>
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
