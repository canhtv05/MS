'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/customs/avatar';
import Ring from '@/components/customs/ring';
import { StaticImageData } from 'next/image';

interface IHomeHeaderAvatar {
  src: StaticImageData;
  fallback: string;
}

const HomeHeaderAvatar = ({ fallback, src }: IHomeHeaderAvatar) => {
  return (
    <>
      {/* <CustomImage
        src={src.src}
        alt={fallback}
        fallbackSrc={images.avt1.src}
        width={35}
        height={35}
        className="rounded-full border-2 border-purple-300 cursor-pointer"
      /> */}
      <Avatar>
        <AvatarImage
          width={35}
          height={35}
          className="rounded-full border-2 border-purple-300 cursor-pointer"
          src={src.src}
          alt={fallback}
        />
        <AvatarFallback>{fallback.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="absolute -bottom-0.5 -right-1">
        <Ring className="border-card! border-2" />
      </div>
    </>
  );
};

export default HomeHeaderAvatar;
