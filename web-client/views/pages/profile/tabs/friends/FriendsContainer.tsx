'use client';

import { Button } from '@/components/ui/button';
import Wrapper from '@/components/ui/wrapper';
import TabsNavigation, { type ITabs } from '@/components/TabsNavigation';
import { useState } from 'react';
import Show from '@/components/Show';
import FriendCard from './FriendCard';
import { useTranslation } from 'react-i18next';
import ChangePrivacy from '../../components/ChangePrivacy';
import { Skeleton } from '@/components/ui/skeleton';
import { useQueryClient } from '@tanstack/react-query';
import { useUserProfileStore } from '@/stores/profile';
import { CACHE_KEY } from '@/configs/cache-key';

interface IFriendsContainerProps {
  showMoreButton?: boolean;
}

const LoadingSkeleton = () => {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="w-full h-12" />
      ))}
    </>
  );
};

const FriendsContainer = ({ showMoreButton = true }: IFriendsContainerProps) => {
  const { t } = useTranslation('profile');
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useUserProfileStore();
  const queryClient = useQueryClient();
  const isLoading =
    queryClient.isFetching({
      queryKey: CACHE_KEY.PROFILE.QUERY.USER_PROFILE(user?.userId),
    }) > 0 || !user?.userId;

  const manyTabs: ITabs<'all_friends' | 'following'>[] = [
    {
      id: 'all_friends',
      labelKey: t('all'),
    },
    {
      id: 'following',
      labelKey: t('following'),
    },
  ];

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const handleHiddenTabSelect = (tabId: string) => {
    const index = manyTabs.findIndex(tab => tab.id === tabId);
    if (index !== -1) {
      setActiveTab(index);
    }
  };

  return (
    <Wrapper
      title={t('friends')}
      endNode={
        <div className="flex items-center gap-2">
          <Button variant="ghost">
            <span className="text-sm font-medium">{t('friend_requests')}</span>
          </Button>
          <Button variant="ghost">
            <span className="text-sm font-medium">{t('find_friends')}</span>
          </Button>
          <ChangePrivacy type="friends" />
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
          indicatorFullWidth
        />
      </div>
      <Wrapper className="mt-(--sp-card)">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-x-(--sp-card) gap-y-[calc(var(--sp-card)*2)]">
          <Show when={!isLoading} fallback={<LoadingSkeleton />}>
            {Array.from({ length: 4 }).map((_, index) => (
              <FriendCard key={index} />
            ))}
          </Show>
        </div>
      </Wrapper>
      <Show when={showMoreButton && !isLoading}>
        <Wrapper className="mt-(--sp-card) flex items-center mx-auto justify-center">
          <Button variant={'outline'} className="w-full" size={'lg'}>
            {t('view_more')}
          </Button>
        </Wrapper>
      </Show>
    </Wrapper>
  );
};

export default FriendsContainer;
