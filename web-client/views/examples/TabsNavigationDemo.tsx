'use client';

import { useState } from 'react';
import {
  Bookmark,
  Library,
  ClipboardText,
  UsersGroupTwoRounded,
} from '@solar-icons/react-perf/BoldDuotone';
import TabsNavigation, { type ITabs } from '@/components/TabsNavigation';

export default function TabsNavigationDemo() {
  const [activeTab, setActiveTab] = useState(0);

  // Ví dụ 1: Tabs đơn giản - không có privacy
  // Sử dụng các keys có sẵn trong translation hoặc label trực tiếp
  const simpleTabs: ITabs<string>[] = [
    {
      id: 'posts',
      labelKey: 'posts',
      icon: <Bookmark className="text-current size-[16px]" />,
    },
    {
      id: 'introduce',
      labelKey: 'introduce',
      icon: <ClipboardText className="text-current size-[16px]" />,
    },
    {
      id: 'friends',
      labelKey: 'friends',
      icon: <UsersGroupTwoRounded className="text-current size-[16px]" />,
    },
  ];

  // Ví dụ 2: Tabs với nhiều items (sẽ hiển thị dropdown "More")
  // Lặp lại các tabs để demo dropdown "More"
  const manyTabs: ITabs<string>[] = [
    {
      id: 'posts',
      labelKey: 'posts',
      icon: <Bookmark className="text-current size-[16px]" />,
    },
    {
      id: 'introduce',
      labelKey: 'introduce',
      icon: <ClipboardText className="text-current size-[16px]" />,
    },
    {
      id: 'friends',
      labelKey: 'friends',
      icon: <UsersGroupTwoRounded className="text-current size-[16px]" />,
    },
    {
      id: 'gallery',
      labelKey: 'pictures',
      icon: <Library className="text-current size-[16px]" />,
    },
  ];

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    console.log('Tab clicked:', index);
  };

  const handleHiddenTabSelect = (tabId: string) => {
    const index = manyTabs.findIndex(tab => tab.id === tabId);
    if (index !== -1) {
      setActiveTab(index);
      console.log('Hidden tab selected:', tabId);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gray-50/50 p-8 dark:bg-gray-950/50">
      <div className="mb-12 w-full max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">TabsNavigation Demo</h1>
          <p className="mt-2 text-muted-foreground">
            Ví dụ sử dụng component TabsNavigation với các cấu hình khác nhau
          </p>
        </div>

        {/* Ví dụ 1: Tabs đơn giản - 3 tabs */}
        <div className="mb-12 rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Ví dụ 1: Tabs đơn giản</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Tabs cơ bản với 3 items, không có privacy, maxVisible mặc định
          </p>
          <div className="rounded-lg border bg-background p-4">
            <TabsNavigation
              tabs={simpleTabs}
              activeTab={activeTab < simpleTabs.length ? activeTab : 0}
              onTabClick={handleTabClick}
              onHiddenTabSelect={handleHiddenTabSelect}
              translationNamespace="profile"
            />
            <div className="mt-4 p-4 bg-muted rounded-md">
              <p className="text-sm">
                Active Tab: {simpleTabs[activeTab < simpleTabs.length ? activeTab : 0]?.labelKey}
              </p>
            </div>
          </div>
        </div>

        {/* Ví dụ 2: Tabs với maxVisible cố định */}
        <div className="mb-12 rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Ví dụ 2: Tabs với maxVisible cố định
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Hiển thị tối đa 3 tabs, các tabs còn lại sẽ vào dropdown &quot;More&quot;
          </p>
          <div className="rounded-lg border bg-background p-4">
            <TabsNavigation
              tabs={manyTabs}
              activeTab={activeTab}
              maxVisible={3}
              onTabClick={handleTabClick}
              onHiddenTabSelect={handleHiddenTabSelect}
              translationNamespace="profile"
            />
            <div className="mt-4 p-4 bg-muted rounded-md">
              <p className="text-sm">Active Tab: {manyTabs[activeTab]?.labelKey || 'None'}</p>
            </div>
          </div>
        </div>

        {/* Ví dụ 3: Tabs responsive */}
        <div className="mb-12 rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Ví dụ 3: Tabs responsive</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Số lượng tabs hiển thị thay đổi theo kích thước màn hình
          </p>
          <div className="rounded-lg border bg-background p-4">
            <TabsNavigation
              tabs={manyTabs}
              activeTab={activeTab}
              maxVisible={{ mobile: 2, tablet: 3, desktop: 4 }}
              onTabClick={handleTabClick}
              onHiddenTabSelect={handleHiddenTabSelect}
              translationNamespace="profile"
            />
            <div className="mt-4 p-4 bg-muted rounded-md">
              <p className="text-sm">Active Tab: {manyTabs[activeTab]?.labelKey || 'None'}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Resize cửa sổ để xem số lượng tabs thay đổi
              </p>
            </div>
          </div>
        </div>

        {/* Ví dụ 4: Tabs với loading state */}
        <div className="mb-12 rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Ví dụ 4: Tabs với loading state
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">Hiển thị skeleton khi đang loading</p>
          <div className="rounded-lg border bg-background p-4">
            <TabsNavigation
              tabs={manyTabs}
              activeTab={activeTab}
              isLoading={true}
              maxVisible={3}
              onTabClick={handleTabClick}
              onHiddenTabSelect={handleHiddenTabSelect}
              translationNamespace="profile"
            />
          </div>
        </div>

        {/* Code Example */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Cách sử dụng</h2>
          <div className="rounded-lg border bg-muted p-4">
            <pre className="overflow-x-auto text-sm">
              <code>{`import TabsNavigation from '@/views/pages/profile/tabs/TabsNavigation';

// Định nghĩa tabs
const tabs = [
  {
    id: 'home',
    labelKey: 'Home',
    icon: <Home className="text-current size-[16px]" />,
  },
  {
    id: 'profile',
    labelKey: 'Profile',
    icon: <User className="text-current size-[16px]" />,
  },
];

// Sử dụng component
<TabsNavigation
  tabs={tabs}
  activeTab={activeTab}
  onTabClick={(index) => setActiveTab(index)}
  onHiddenTabSelect={(tabId) => {
    const index = tabs.findIndex(tab => tab.id === tabId);
    if (index !== -1) setActiveTab(index);
  }}
  translationNamespace="profile"
  // Optional props:
  // maxVisible={3} // hoặc { mobile: 2, tablet: 3, desktop: 4 }
  // isLoading={false}
  // getTabPrivacy={(tabId) => ({ ... })} // Nếu cần privacy
  // moreLabelKey="more"
/>`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
