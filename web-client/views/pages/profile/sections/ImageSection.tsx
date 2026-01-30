'use client';

import { IDetailUserProfileDTO } from '@/types/profile';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Keyboard, Navigation, Pagination } from 'swiper/modules';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/animate-ui/primitives/base/dialog';
import { IconButton } from '@/components/animate-ui/components/buttons/icon';
import { XIcon } from '@/components/animate-ui/icons';
import { useTranslation } from 'react-i18next';

interface IImageSectionProps {
  data?: IDetailUserProfileDTO;
  isLoading?: boolean;
}

const ImageSection = ({ data, isLoading }: IImageSectionProps) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-1.5 mt-2">
        {[...Array(9)].map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full rounded-lg" />
        ))}
      </div>
    );
  }

  const list = data?.images?.data || [];
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
              <Image
                src={img.imageUrl}
                alt={img.originFileName}
                fill
                sizes="(max-width: 768px) 33vw, 200px"
                className="object-cover transition-all duration-300 group-hover:scale-110 group-hover:brightness-110"
              />
              <span className="absolute inset-0 bg-black/0 transition-opacity duration-200 group-hover:bg-black/20" />
            </button>
          );
        })}
      </div>

      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-[95vw] w-[95vw] h-[90vh] sm:h-[92vh] border-none p-0"
        >
          <DialogHeader className="hidden">
            <DialogTitle className={'hidden'} />
            <DialogDescription className="hidden" />
          </DialogHeader>
          <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border">
            <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/10">
              <div className="flex items-center gap-2 text-xs text-foreground/70">
                <span className="font-semibold text-foreground">
                  {activeIndex + 1} / {list.length}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline max-w-[240px] truncate">
                  {list[activeIndex]?.originFileName || 'Image'}
                </span>
              </div>
              <DialogClose asChild>
                <IconButton variant="ghost" className="rounded-full text-foreground/70">
                  <XIcon />
                </IconButton>
              </DialogClose>
            </div>
            <div className="relative flex-1">
              <Swiper
                key={activeIndex}
                modules={[Navigation, Pagination, Keyboard, EffectFade]}
                initialSlide={activeIndex}
                effect="fade"
                navigation
                fadeEffect={{
                  crossFade: true,
                }}
                speed={500}
                pagination={{ clickable: true }}
                keyboard={{ enabled: true }}
                onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
                className="h-full w-full"
              >
                {list.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="relative h-full w-full">
                      <Image
                        src={img.imageUrl}
                        alt={img.originFileName}
                        fill
                        sizes="(max-width: 768px) 100vw, 1200px"
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-foreground/10 text-xs text-foreground/60">
              <span>Swipe to browse</span>
              <span className="hidden sm:inline">Use ← → keys</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageSection;
