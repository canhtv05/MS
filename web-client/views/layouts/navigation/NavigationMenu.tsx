'use client';

import { usePathname } from 'next/navigation';
import { Activity, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import {
  TooltipPanel,
  TooltipTrigger,
  Tooltip,
} from '@/components/animate-ui/components/base/tooltip';
import useViewport from '@/hooks/use-view-port';
import { Viewport } from '@/enums/common';
import { APP_CONFIGS } from '@/configs';
import Link from 'next/link';
import { Home, UsersGroupRounded, Album, Calendar } from '@solar-icons/react-perf/BoldDuotone';

interface IMenuNavigation {
  title: string;
  href: string;
  icon: ReactNode;
  isActive?: boolean;
}

const MENU: IMenuNavigation[] = [
  {
    title: 'navigation.home',
    href: APP_CONFIGS.ROUTES.home,
    icon: <Home className="size-5 text-foreground/70 stroke-[2.5px]" />,
    isActive: true,
  },
  {
    title: 'navigation.friends',
    href: APP_CONFIGS.ROUTES.friends,
    icon: <UsersGroupRounded className="text-foreground/70 size-5 stroke-2" />,
  },
  {
    title: 'navigation.photos',
    href: APP_CONFIGS.ROUTES.photos,
    icon: <Album className="size-5 text-foreground/70 stroke-2" />,
  },
  {
    title: 'navigation.new_feed',
    href: APP_CONFIGS.ROUTES.newFeed,
    icon: <Calendar className="size-5 text-foreground/70 stroke-2" />,
  },
];

const NavigationMenu = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { t } = useTranslation('navigation');
  const pathname = usePathname();
  const [tooltipSide, setTooltipSide] = useState<'top' | 'right' | null>(null);
  const { width } = useViewport();

  const isActive = (href: string) => pathname === href;

  useEffect(() => {
    const updateTooltipSide = () => {
      if (width >= Viewport.MD && width < Viewport.LG) {
        setTooltipSide('right');
        return;
      }

      if (width >= Viewport.LG && isCollapsed) {
        setTooltipSide('right');
        return;
      }
      if (width >= Viewport.LG) {
        setTooltipSide(null);
      } else {
        setTooltipSide('top');
      }
    };
    updateTooltipSide();
  }, [width, isCollapsed]);

  return (
    <div className="lg:flex flex md:flex-col flex-row gap-1 items-start justify-center group w-full rounded-lg md:mt-0 mt-0 md:mb-0 mb-2">
      <div
        className={cn(
          'md:w-full w-[220px] custom-bg-1 md:border-none border lg:flex  flex md:flex-col flex-row p-2 gap-1 items-start justify-center rounded-lg transition-[padding] duration-300 ease-out',
          !isCollapsed && 'lg:p-3 lg:w-full',
        )}
      >
        {MENU.map((item, index) => {
          const linkContent = (
            <>
              <span
                className={cn(
                  'flex items-center justify-start',
                  isActive(item.href) ? `[&_svg]:text-primary` : '',
                )}
              >
                {item.icon}
              </span>
              <Activity mode={isCollapsed ? 'hidden' : 'visible'}>
                <span
                  className={cn(
                    'whitespace-nowrap ml-3 text-sm lg:block hidden text-foreground/70',
                    isActive(item.href) ? 'text-primary font-black' : 'font-bold',
                  )}
                >
                  {t(item.title)}
                </span>
              </Activity>
            </>
          );

          if (tooltipSide === null) {
            return (
              <Link
                key={index}
                href={item.href}
                title={t(item.title)}
                suppressHydrationWarning
                className={cn(
                  `flex lg:p-4 p-3 rounded-lg lg:w-full w-auto hover:bg-gray-100 dark:hover:bg-gray-900 items-center justify-start`,
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
                  `flex box-border p-3 justify-start rounded-lg w-(--sidebar-width-collapsed) h-(--sidebar-width-collapsed) cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 items-center`,
                  isActive(item.href) && 'bg-gray-100 dark:bg-gray-700',
                  width >= Viewport.MD && width < Viewport.LG && 'py-[18px]!',
                  isCollapsed && width >= Viewport.LG && 'py-[18px]!',
                )}
              >
                <Link
                  href={item.href}
                  title={t(item.title)}
                  suppressHydrationWarning
                  className={cn('grid place-content-center w-full')}
                >
                  {linkContent}
                </Link>
              </TooltipTrigger>
              <TooltipPanel
                className="whitespace-nowrap"
                side={tooltipSide || 'right'}
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1 }}
                transition={{ duration: 0.1 }}
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

export default NavigationMenu;
