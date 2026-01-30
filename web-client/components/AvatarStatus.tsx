'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Ring from '@/components/ui/ring';
import { cn } from '@/lib/utils';
import { StaticImageData } from 'next/image';

import { ClassValue } from 'clsx';

interface IAvatarStatus {
  src: StaticImageData | string;
  fallback: string;
  isOnline?: boolean;
  hasAnimation?: boolean;
  size?: number;
  ringClassName?: ClassValue;
  hasRing?: boolean;
}

const AvatarStatus = ({
  fallback,
  src,
  isOnline = true,
  hasAnimation = true,
  size = 35,
  ringClassName = 'border-2',
  hasRing = true,
}: IAvatarStatus) => {
  return (
    <div className="relative">
      <Avatar style={{ width: `${size}px`, height: `${size}px` }}>
        <AvatarImage
          className="rounded-full border-2 border-purple-300 cursor-pointer"
          src={typeof src === 'string' ? src : src.src}
          alt={fallback}
        />
        <AvatarFallback>{fallback.charAt(0)}</AvatarFallback>
      </Avatar>
      {hasRing && (
        <div className="absolute -bottom-0.5 -right-1">
          <Ring
            className={cn('border-2', ringClassName)}
            isOnline={isOnline}
            hasAnimation={hasAnimation}
          />
        </div>
      )}
    </div>
  );
};

export default AvatarStatus;
