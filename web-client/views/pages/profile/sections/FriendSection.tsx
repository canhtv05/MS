'use client';

import { IDetailUserProfileDTO } from '@/types/profile';
import { Skeleton } from '@/components/customs/skeleton';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface IFriendSectionProps {
  data?: IDetailUserProfileDTO;
  isLoading?: boolean;
}

const FriendSection = ({ data, isLoading }: IFriendSectionProps) => {
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

  const list = data?.images?.data.slice(0, 9) || [];
  if (!list.length) {
    return <p className="text-center text-sm text-foreground/60 p-4">{t('common:no_data')}</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-2 rounded-md overflow-hidden">
      {list.map((img, idx) => {
        return (
          <div key={idx}>
            <div
              className={cn(
                'overflow-hidden relative aspect-square group cursor-pointer rounded-md',
              )}
            >
              <div className="relative aspect-square">
                <Image
                  src={img.imageUrl}
                  alt={img.originFileName}
                  fill
                  sizes="(max-width: 768px) 33vw, 200px"
                  className="object-cover transition-all rounded-md duration-300 group-hover:scale-110 group-hover:brightness-110"
                />
              </div>
            </div>
            <h3 className="text-xs text-center text-wrap whitespace-normal break-normal wrap-break-word mt-2">
              {img.imageUrl}
            </h3>
          </div>
        );
      })}
    </div>
  );
};

export default FriendSection;
