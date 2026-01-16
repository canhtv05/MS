'use client';

import { IDetailUserProfileDTO } from '@/types/profile';
import { Skeleton } from '@/components/customs/skeleton';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface IImageSectionProps {
  data?: IDetailUserProfileDTO;
  isLoading?: boolean;
}

const ImageSection = ({ data, isLoading }: IImageSectionProps) => {
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
    return null;
  }

  return (
    <div className="grid grid-cols-3 gap-1 rounded-md overflow-hidden">
      {list.map((img, idx) => {
        const isTopLeft = idx === 0;
        const isTopRight = idx === 2 || (list.length < 3 && idx === list.length - 1);
        const isBottomLeft = idx === Math.floor((list.length - 1) / 3) * 3;
        const isBottomRight = idx === list.length - 1;

        return (
          <div
            key={idx}
            className={cn(
              'relative aspect-square overflow-hidden group cursor-pointer',
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
          </div>
        );
      })}
    </div>
  );
};

export default ImageSection;
