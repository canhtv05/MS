'use client';

import images from '@/public/imgs';
import Image from 'next/image';
import { memo } from 'react';

type ImageCardProps = {
  src?: string;
  alt?: string;
};

const ImageCard = ({ src = images.avt1.src, alt = 'Album image' }: ImageCardProps) => {
  return (
    <article className="group relative w-full overflow-hidden rounded-xl bg-muted transition-[box-shadow,transform] duration-200 hover:shadow-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background cursor-pointer aspect-square">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
      />
      <div
        className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/20"
        aria-hidden
      />
    </article>
  );
};

export default memo(ImageCard);
