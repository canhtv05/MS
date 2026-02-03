'use client';

import { useTranslation } from 'react-i18next';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { TNavIntroduceItem } from './TabIntroduce';

interface INavIntroduceProps {
  menu: Record<TNavIntroduceItem, readonly string[]>;
  activeTab: TNavIntroduceItem;
}

const NavIntroduce = ({ menu, activeTab }: INavIntroduceProps) => {
  const { t } = useTranslation('profile');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleTabClick = (tab: TNavIntroduceItem) => {
    const currentTab = searchParams.get('tab');
    const params = new URLSearchParams(searchParams.toString());
    params.set('subtab', tab);
    if (currentTab) {
      params.set('tab', currentTab);
    }

    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  return (
    <nav className="flex flex-col gap-2 items-start justify-start [&_button]:hover:bg-gray-100 [&_button]:dark:hover:bg-gray-900">
      {Object.entries(menu).map(([key]) => (
        <button
          key={key}
          className={`w-full rounded-lg cursor-pointer p-2 ${activeTab === key ? 'text-white bg-primary/80 hover:bg-primary!' : 'text-muted-foreground'}`}
          onClick={() => handleTabClick(key as TNavIntroduceItem)}
        >
          <div className="w-full">
            <h3 className="font-medium text-sm text-start">{t(`navigation.${key}`)}</h3>
          </div>
        </button>
      ))}
    </nav>
  );
};

export default NavIntroduce;
