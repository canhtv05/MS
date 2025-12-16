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

const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);
const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

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

const NavigationHeader = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { userProfile, user } = useNavigationLayout();
  const router = useRouter();

  return (
    <div
      className={cn(
        'dark:bg-gray-800 p-4 w-full shadow-[0_0_10px_0_rgba(0,0,0,0.07)] lg:block inline-flex bg-white rounded-lg transition-all duration-300',
      )}
    >
      <div
        onClick={() => router.push(`/@${user?.username}`)}
        className={cn(
          'group lg:flex flex-col inline-flex lg:items-start items-center justify-center gap-2 bg-gray-100 rounded-lg cursor-pointer transition-all duration-300',
          isCollapsed
            ? 'p-1 bg-transparent dark:bg-transparent inline-flex h-full'
            : 'lg:p-4 p-0.5 lg:dark:bg-gray-700 dark:bg-gray-800',
        )}
      >
        <UserProfileCard
          username={user?.username || ''}
          avatarUrl={userProfile?.avatarUrl || images.avt1.src}
          fullName={user?.fullName || ''}
          hasRing={false}
          responsive
          hideInfo={isCollapsed}
          className={cn(isCollapsed && 'justify-end')}
        />

        {!isCollapsed && (
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
        )}
      </div>
    </div>
  );
};

const NavigationMenu = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { t } = useTranslation('navigation');
  const pathname = usePathname();
  const [tooltipSide, setTooltipSide] = useState<'top' | 'right' | null>(null);
  const { width } = useViewport();

  const isActive = (href: string) => pathname === href;

  useEffect(() => {
    const updateTooltipSide = () => {
      if (isCollapsed && width >= Viewport.LG) {
        setTooltipSide('right');
        return;
      }

      if (width >= Viewport.LG) {
        setTooltipSide(null);
      } else if (width >= Viewport.MD) {
        setTooltipSide('right');
      } else {
        setTooltipSide('top');
      }
    };
    updateTooltipSide();
  }, [width, isCollapsed]);

  return (
    <div className="lg:flex inline-flex md:flex-col flex-row gap-1 items-start justify-center group w-full rounded-lg md:mt-0 mt-0 md:mb-0 mb-2">
      <div
        className={cn(
          'w-auto dark:bg-gray-800 bg-white md:border-none border lg:flex shadow-[0_0_10px_0_rgba(0,0,0,0.07)] inline-flex md:flex-col flex-row p-2 gap-1 items-start justify-center rounded-lg transition-all duration-300 ease-in-out',
          isCollapsed ? 'lg:w-[72px]' : 'lg:w-full md:p-3',
        )}
      >
        {menu.map((item, index) => {
          const linkContent = (
            <>
              <span
                className={cn(
                  'shrink-0 transition-all duration-300',
                  isActive(item.href) ? `[&_svg]:text-primary` : '',
                )}
              >
                {item.icon}
              </span>
              <span
                className={cn(
                  'overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out',
                  isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100 ml-3',
                  'text-sm lg:block hidden text-foreground/70',
                  isActive(item.href) ? 'text-primary font-black' : 'font-bold',
                )}
              >
                {t(item.title)}
              </span>
            </>
          );

          if (tooltipSide === null && !isCollapsed) {
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  `flex lg:p-4 p-3 rounded-lg lg:w-full w-auto hover:bg-gray-100 dark:hover:bg-gray-900 items-center justify-start transition-all duration-300`,
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
                  `flex lg:p-4 p-3 rounded-lg lg:w-full w-auto hover:bg-gray-100 dark:hover:bg-gray-900 items-center justify-start transition-all duration-300`,
                  isActive(item.href) && 'bg-gray-100 dark:bg-gray-700',
                  isCollapsed ? 'justify-start py-[18px]!' : '',
                )}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center w-full justify-start',
                    isCollapsed ? 'pl-[2px]' : '',
                  )}
                >
                  {linkContent}
                </Link>
              </TooltipTrigger>
              <TooltipPanel
                side={tooltipSide || 'right'}
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        'w-auto transition-all duration-300 relative',
        isCollapsed ? 'lg:w-[72px]' : 'lg:w-64',
      )}
    >
      <div className="h-full flex md:flex-col flex-row md:justify-start justify-center items-start lg:gap-7 gap-4 w-full">
        <div className={cn('md:block hidden', isCollapsed ? 'w-auto' : 'w-full')}>
          <NavigationHeader isCollapsed={isCollapsed} />
        </div>
        <div className="md:order-2 order-1 md:relative md:bottom-auto fixed bottom-0 z-50 md:z-auto w-full">
          <NavigationMenu isCollapsed={isCollapsed} />
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden cursor-pointer lg:flex absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-md items-center justify-center text-gray-500 hover:text-primary transition-colors z-50"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="size-4" />
            ) : (
              <ChevronLeftIcon className="size-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavigationLayout;
