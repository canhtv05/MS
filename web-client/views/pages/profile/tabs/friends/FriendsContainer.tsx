'use client';

import { Button } from '@/components/ui/button';
import Wrapper from '@/components/ui/wrapper';
import TabsNavigation, { type ITabs } from '@/components/TabsNavigation';
import { ThreeSquares } from '@solar-icons/react-perf/category/style/BoldDuotone';
import { useState } from 'react';
import Show from '@/components/Show';
import { logger } from '@/lib/logger';
import FriendCard from './FriendCard';

const FriendsContainer = () => {
  const [activeTab, setActiveTab] = useState(0);
  const manyTabs: ITabs<'all_friends' | 'following'>[] = [
    {
      id: 'all_friends',
      labelKey: 'Tất cả bạn bè',
    },
    {
      id: 'following',
      labelKey: 'Đang theo dõi',
    },
  ];

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    logger.log('Tab clicked:', index);
  };

  const handleHiddenTabSelect = (tabId: string) => {
    const index = manyTabs.findIndex(tab => tab.id === tabId);
    if (index !== -1) {
      setActiveTab(index);
      logger.log('Hidden tab selected:', tabId);
    }
  };

  return (
    <Wrapper
      title="Friends"
      endNode={
        <div className="flex items-center gap-2">
          <Button variant="ghost">
            <span className="text-sm font-medium">Lời mời kết bạn</span>
          </Button>
          <Button variant="ghost">
            <span className="text-sm font-medium">Tìm bạn bè</span>
          </Button>
          <Button variant="default">
            <ThreeSquares className="text-current size-[16px]" />
          </Button>
        </div>
      }
    >
      <div className="max-w-[250px]">
        <TabsNavigation
          tabs={manyTabs}
          activeTab={activeTab}
          onTabClick={handleTabClick}
          onHiddenTabSelect={handleHiddenTabSelect}
          translationNamespace="profile"
          variant="no-border"
        />
      </div>
      <Wrapper className="mt-(--sp-card)">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-x-(--sp-card) gap-y-[calc(var(--sp-card)*2)]">
          <Show when={activeTab === 0}>
            <FriendCard />
            <FriendCard />
            <FriendCard />
            <FriendCard />
          </Show>
          <Show when={activeTab === 1}>
            <FriendCard />
            <FriendCard />
            <FriendCard />
            <FriendCard />
          </Show>
        </div>
      </Wrapper>
    </Wrapper>
  );
};

export default FriendsContainer;
