'use client';

import { Button } from '@/components/ui/button';
import Wrapper from '@/components/ui/wrapper';
import ImageCard from './ImageCard';
import { useState } from 'react';
import TabsNavigation, { ITabs } from '@/components/TabsNavigation';
import { useTranslation } from 'react-i18next';
import ChangePrivacy from '../../components/ChangePrivacy';
import SwiperDialog from '../../components/SwiperDialog';
import { useUserProfileStore } from '@/stores/profile';
import { IImageHistoryDTO } from '@/types/profile';
import Show from '@/components/Show';
import { useQueryClient } from '@tanstack/react-query';
import { CACHE_KEY } from '@/configs/cache-key';
import { Skeleton } from '@/components/ui/skeleton';

interface IAlbumsContainerProps {
  showMoreButton?: boolean;
}

const LoadingSkeleton = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="w-full aspect-square h-full" />
      ))}
    </>
  );
};

const AlbumsContainer = ({ showMoreButton = true }: IAlbumsContainerProps) => {
  const { t } = useTranslation('profile');
  const [activeTab, setActiveTab] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { user } = useUserProfileStore();
  const queryClient = useQueryClient();
  const isLoading =
    queryClient.isFetching({
      queryKey: CACHE_KEY.PROFILE.QUERY.USER_PROFILE(user?.userId),
    }) > 0 || !user?.userId;

  const list =
    user?.images?.data?.map((item: IImageHistoryDTO) => ({
      imageUrl: item.imageUrl,
      originFileName: item.originFileName,
    })) || [];

  const manyTabs: ITabs<'all' | 'avatar' | 'cover' | 'other'>[] = [
    {
      id: 'all',
      labelKey: t('all'),
    },
    {
      id: 'avatar',
      labelKey: t('avatar_image'),
    },
    {
      id: 'cover',
      labelKey: t('cover_image'),
    },
    {
      id: 'other',
      labelKey: t('other'),
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

  const handleImageClick = (index: number) => {
    setActiveIndex(index);
    setIsViewerOpen(true);
  };

  return (
    <>
      <Wrapper
        title={t('albums')}
        endNode={
          <div className="flex items-center gap-2">
            <Button variant="ghost">
              <span className="text-sm font-medium">{t('add_image')}</span>
            </Button>
            <ChangePrivacy type="gallery" />
          </div>
        }
      >
        <div className="max-w-[400px]">
          <TabsNavigation
            tabs={manyTabs}
            activeTab={activeTab}
            onTabClick={handleTabClick}
            onHiddenTabSelect={handleHiddenTabSelect}
            translationNamespace="profile"
            variant="no-border"
            indicatorFullWidth
            maxVisible={{
              desktop: 4,
              mobile: 4,
              tablet: 4,
            }}
          />
        </div>
        <Wrapper className="mt-(--sp-card)">
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3"
            role="list"
            aria-label={t('albums')}
          >
            <Show when={!isLoading} fallback={<LoadingSkeleton />}>
              {list.map((item, index: number) => (
                <div key={index} onClick={() => handleImageClick(index)}>
                  <ImageCard src={item.imageUrl} alt={item.originFileName} />
                </div>
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
      <SwiperDialog
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        list={list}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
    </>
  );
};

export default AlbumsContainer;
