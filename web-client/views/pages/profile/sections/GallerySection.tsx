'use client';

import { IDetailUserProfileDTO } from '@/types/profile';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SwiperDialog from '../components/SwiperDialog';
import { IImageResponse } from '@/types/file';
import { getDisplayImageUrl } from '@/utils/imageUrl';

interface IGallerySectionProps {
  data?: IDetailUserProfileDTO;
  isLoading?: boolean;
}

const GallerySection = ({ data, isLoading }: IGallerySectionProps) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set());
  const { t } = useTranslation();

  const handleImageError = (url: string) => {
    setFailedUrls(prev => new Set(prev).add(url));
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-1.5 mt-2">
        {[...Array(9)].map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full rounded-lg" />
        ))}
      </div>
    );
  }

  const list =
    data?.images?.data.map((item: IImageResponse) => ({
      imageUrl: item.imageUrl,
      originFileName: item.originFileName,
    })) || [];
  if (!list.length) {
    return <p className="text-center text-sm text-foreground/60 p-4">{t('common:no_data')}</p>;
  }

  return (
    <>
      <div className="grid grid-cols-3 h-auto gap-1 rounded-md overflow-hidden">
        {list.map((img, idx) => {
          const isTopLeft = idx === 0;
          const isTopRight = idx === 2 || (list.length < 3 && idx === list.length - 1);
          const isBottomLeft = idx === Math.floor((list.length - 1) / 3) * 3;
          const isBottomRight = idx === list.length - 1;

          return (
            <button
              key={idx}
              type="button"
              aria-label={`Open image ${idx + 1}`}
              onClick={() => {
                setActiveIndex(idx);
                setIsViewerOpen(true);
              }}
              className={cn(
                'relative aspect-square overflow-hidden group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70',
                isTopLeft && 'rounded-tl-md',
                isTopRight && 'rounded-tr-md',
                isBottomLeft && 'rounded-bl-md',
                isBottomRight && 'rounded-br-md',
              )}
            >
              {failedUrls.has(img.imageUrl) ? (
                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
                  {t('common:no_data')}
                </div>
              ) : (
                <Image
                  src={getDisplayImageUrl(img.imageUrl)}
                  alt={img.originFileName ?? 'Image'}
                  fill
                  sizes="(max-width: 768px) 33vw, 200px"
                  className="object-cover transition-all duration-300 group-hover:scale-110 group-hover:brightness-110"
                  unoptimized
                  onError={() => handleImageError(img.imageUrl)}
                />
              )}
              <span className="absolute inset-0 bg-black/0 transition-opacity duration-200 group-hover:bg-black/20" />
            </button>
          );
        })}
      </div>

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

export default GallerySection;
