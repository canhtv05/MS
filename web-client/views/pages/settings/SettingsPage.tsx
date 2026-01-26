'use client';

import Wrapper from '@/components/customs/wrapper';
import { cn } from '@/lib/utils';
import { LockPassword, UserCircle } from '@solar-icons/react-perf/category/style/Linear';
import { Fragment, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Privacy from './privacy/Privacy';

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
    icon: <UserCircle className="size-7 stroke-2" />,
    key: 'account',
  },
  {
    title: 'privacy.title',
    icon: <LockPassword className="size-7 stroke-2" />,
    key: 'privacy',
  },
];

const SETTINGS_MENU_CONTENT: ISettingsMenuContent[] = [
  {
    key: 'account',
    content: <div className="bg-red-500  h-[1000px]!">Quản lý tài khoản</div>,
  },
  {
    key: 'privacy',
    content: <Privacy />,
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
      {/* <div className="fixed inset-0 h-(--header-height) bg-red-500 z-70">hellowirld</div> */}
      <div className="flex pb-(--sp-layout) h-full min-h-0 [&>div]:rounded-md [&>div]:h-full [&>div]:custom-bg-1 gap-(--sp-layout)">
        <div className="flex-1 min-h-0 overflow-hidden shadow-[0_8px_10px_-4px_rgba(0,0,0,0.08)]">
          <Wrapper className="px-0">
            <div className="flex flex-col">
              {SETTINGS_MENU.map(item => (
                <button
                  key={item.key}
                  onClick={() => handleClick(item.key)}
                  className={cn(
                    'cursor-pointer flex p-3 px-5 items-center gap-2',
                    activeMenu === item.key ? 'text-primary' : '',
                  )}
                >
                  {item.icon}
                  {t(item.title)}
                </button>
              ))}
            </div>
          </Wrapper>
        </div>
        <div className="flex-2 min-h-0 overflow-y-auto no-scrollbar shadow-[0_8px_10px_-4px_rgba(0,0,0,0.08)]">
          <Wrapper className="flex flex-col py-0">
            {SETTINGS_MENU_CONTENT.map(item => (
              <div
                className="py-(--sp-card)"
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
