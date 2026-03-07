'use client';

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
import Image from 'next/image';

interface ISwiperDialogProps {
  isOpen: boolean;
  onClose: () => void;
  list: {
    imageUrl: string;
    originFileName: string;
  }[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}
const SwiperDialog = ({
  isOpen,
  onClose,
  list,
  activeIndex,
  setActiveIndex,
}: ISwiperDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      <DialogContent
        showOverlay={false}
        customOverlay={
          <div
            className="fixed inset-0 z-200 bg-black/80 animate-in fade-in-0 duration-200"
            aria-hidden
          />
        }
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
              <IconButton
                autoFocus={false}
                variant="ghost"
                className="rounded-full text-foreground/70"
              >
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
          <div className="flex items-center justify-center px-4 py-3 border-t border-foreground/10 text-xs text-foreground/60">
            <span className="hidden sm:inline">Use ← → keys</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SwiperDialog;
