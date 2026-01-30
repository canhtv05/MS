import images from '@/public/imgs';
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface CustomImageProps extends ImageProps {
  fallbackSrc?: string;
}

const CustomImage = ({ fallbackSrc, src, width, height, alt, ...props }: CustomImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      width={width}
      alt={alt}
      height={height}
      {...props}
      onError={() => {
        if (!fallbackSrc) {
          setImgSrc(images.fallBackImg);
        } else {
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
};

export default CustomImage;
