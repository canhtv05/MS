'use client';

import Wrapper from '@/components/customs/wrapper';
import { cn } from '@/lib/utils';
import { LockPassword, UserCircle, Alarm } from '@solar-icons/react-perf/category/style/Linear';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Privacy from './tabs/Privacy';
import Account from './tabs/Account';
import { Portal } from 'radix-ui';
import Notification from './tabs/Notification';

interface ISettingsMenu {
  title: string;
  icon: React.ReactNode;
  key: string;
}

interface ISettingsMenuContent {
  key: string;
  content: React.ReactNode;
}

const SETTINGS_MENU: ISettingsMenu[] = [
  {
    title: 'account.title',
    icon: <UserCircle className="size-7" />,
    key: 'account',
  },
  {
    title: 'privacy.title',
    icon: <LockPassword className="size-7" />,
    key: 'privacy',
  },
  {
    title: 'notification.title',
    icon: <Alarm className="size-7" />,
    key: 'notification',
  },
];

const SETTINGS_MENU_CONTENT: ISettingsMenuContent[] = [
  {
    key: 'account',
    content: <Account />,
  },
  {
    key: 'privacy',
    content: <Privacy />,
  },
  {
    key: 'notification',
    content: <Notification />,
  },
];

const SettingsPage = () => {
  const { t } = useTranslation('settings');

  const [activeMenu, setActiveMenu] = useState<string>('account');
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleClick = (key: string) => {
    setActiveMenu(key);
    refs.current[key]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Portal.Root>
        {/* <div className="fixed inset-0 h-(--header-height) bg-red-500 z-9999">hellowirld</div> */}
      </Portal.Root>
      <div className="flex pb-(--sp-layout) h-full min-h-0 [&>div]:rounded-md [&>div]:h-full [&>div]:custom-bg-1 gap-(--sp-layout)">
        <div className="flex-1 min-h-0 lg:block hidden overflow-hidden shadow-[0_8px_10px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_10px_-4px_rgba(0,0,0,0.3)] min-w-[140px]">
          <Wrapper className="px-0">
            <div className="flex flex-col p-2">
              {SETTINGS_MENU.map(item => (
                <button
                  key={item.key}
                  onClick={() => handleClick(item.key)}
                  className={cn(
                    'cursor-pointer flex p-3 px-4 font-semibold items-center gap-3 rounded-lg text-sm min-w-0',
                    activeMenu === item.key
                      ? 'text-primary bg-primary/10 dark:bg-primary/20'
                      : 'text-foreground/70 hover:bg-accent/50 dark:hover:bg-accent/30',
                  )}
                >
                  <span
                    className={cn(
                      'shrink-0',
                      activeMenu === item.key
                        ? '[&_svg]:text-primary'
                        : '[&_svg]:text-foreground/70',
                    )}
                  >
                    {item.icon}
                  </span>
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
                    {t(item.title)}
                  </span>
                </button>
              ))}
            </div>
          </Wrapper>
        </div>
        <div className="flex-3 min-h-0 overflow-y-auto no-scrollbar shadow-[0_8px_10px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_10px_-4px_rgba(0,0,0,0.3)]">
          <Wrapper className="flex flex-col py-0">
            {SETTINGS_MENU_CONTENT.map((item, idx) => (
              <div
                className={cn(
                  'py-(--sp-card)',
                  idx !== SETTINGS_MENU_CONTENT.length - 1
                    ? 'border-b border-border/50 dark:border-border/30'
                    : '',
                )}
                key={item.key}
                ref={el => {
                  refs.current[item.key] = el;
                }}
              >
                {item.content}
              </div>
            ))}
          </Wrapper>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
