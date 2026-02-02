'use client';

import { useTranslation } from 'react-i18next';
import { TNavIntroduceItem } from './TabIntroduce';

interface INavIntroduceProps {
  menu: Record<TNavIntroduceItem, readonly string[]>;
  activeTab: TNavIntroduceItem;
  setActiveTab: (tab: TNavIntroduceItem) => void;
}

const NavIntroduce = ({ menu, activeTab, setActiveTab }: INavIntroduceProps) => {
  const { t } = useTranslation('profile');

  return (
    <nav className="flex flex-col gap-2 items-start justify-start [&_button]:hover:bg-gray-100 [&_button]:dark:hover:bg-gray-900">
      {Object.entries(menu).map(([key]) => (
        <button
          key={key}
          className={`w-full rounded-lg cursor-pointer p-2 ${activeTab === key ? 'text-white bg-primary/80 hover:bg-primary!' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab(key as TNavIntroduceItem)}
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
