'use client';

import { useMyMediaHistoryInfiniteQuery } from '@/services/queries/profile';
import { useAuthStore } from '@/stores/auth';
import Image from 'next/image';
import { Skeleton } from '@/components/customs/skeleton';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { GalleryMinimalistic } from '@solar-icons/react-perf/BoldDuotone';
import { getDateLabel } from '@/utils/common';
import { useEffect, useRef, useMemo, useCallback } from 'react';
import { IImageHistoryGroupDTO } from '@/types/profile';
import { ResourceType } from '@/enums/common';

interface ProfilePageChooseImageProps {
  onSelect?: (url: string | null) => void;
  selectedUrl?: string | null;
  isAvatar?: boolean;
}

const ProfilePageChooseImage = ({
  onSelect,
  selectedUrl,
  isAvatar = false,
}: ProfilePageChooseImageProps) => {
  const { user } = useAuthStore();
  const { t } = useTranslation('profile');
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleContainerClick = useCallback(() => {
    onSelect?.(null);
  }, [onSelect]);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useMyMediaHistoryInfiniteQuery(
      true,
      user?.auth?.username,
      isAvatar ? [ResourceType.RESOURCE_TYPE_AVATAR] : [ResourceType.RESOURCE_TYPE_COVER],
    );

  const pages = data?.pages;
  const groups = useMemo(() => {
    if (!pages) return [];

    const groupMap = new Map<string, IImageHistoryGroupDTO>();

    pages.forEach(page => {
      const pageGroups = page?.data?.data || [];
      pageGroups.forEach(group => {
        if (groupMap.has(group.date)) {
          const existing = groupMap.get(group.date)!;
          existing.items = [...existing.items, ...group.items];
        } else {
          groupMap.set(group.date, { ...group, items: [...group.items] });
        }
      });
    });

    return Array.from(groupMap.values());
  }, [pages]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [handleObserver]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="aspect-video rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <GalleryMinimalistic className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-sm">{t('no_images_found')}</p>
      </div>
    );
  }

  return (
    <div onClick={handleContainerClick} className="p-1 space-y-6">
      {groups.map((group, groupIdx) => (
        <div key={groupIdx}>
          <div className="flex items-center gap-3 my-2">
            <span className="text-xs font-medium text-muted-foreground">
              {getDateLabel(group.date, t)}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {group.items.map((image, idx) => {
              const isSelected = selectedUrl === image.imageUrl;

              return (
                <button
                  key={image.createdAt || idx}
                  type="button"
                  className={cn(
                    'relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden cursor-pointer',
                    'ring-2 ring-transparent transition-all duration-200',
                    'after:content-[""] after:absolute after:inset-0 after:bg-transparent after:transition-colors after:duration-300 hover:after:bg-white/10',
                    isSelected && 'ring-primary',
                  )}
                  onClick={e => {
                    e.stopPropagation();
                    if (image.imageUrl === selectedUrl) {
                      onSelect?.(null);
                    } else {
                      onSelect?.(image.imageUrl);
                    }
                  }}
                >
                  {image.imageUrl && image.imageUrl.trim() !== '' && (
                    <Image
                      src={image.imageUrl}
                      alt={`Media ${image.resourceType}`}
                      fill
                      className="object-cover absolute inset-0"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      unoptimized
                    />
                  )}
                  {image?.createdAt && (
                    <span className="absolute bottom-2 right-2 text-white bg-black/50 p-1 px-2 text-xs rounded-lg">
                      {image?.createdAt?.toLocaleString()?.split(' ')[1]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div ref={loadMoreRef} className="h-4">
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePageChooseImage;
