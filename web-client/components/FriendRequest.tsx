'use client';

import images from '@/public/imgs';
import CustomImage from './ui/custom-image';
import { Button } from './animate-ui/components/buttons/button';

const FriendRequest = () => {
  return (
    <div className="custom-bg-1 p-4 w-full rounded-md flex flex-col gap-2">
      <div className="flex items-center gap-2 justify-start">
        <CustomImage
          src={images.avt1.src}
          alt=""
          fallbackSrc={images.avt1.src}
          width={35}
          height={35}
          className="rounded-full"
        />
        <div className="text-[13px] leading-normal">
          <span className="font-semibold">Hello world</span>
          <span className="ml-2 text-foreground/70 font-medium">wants to add you to friends</span>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-between mt-3">
        <div className="w-full">
          <Button className="w-full">Accept</Button>
        </div>
        <div className="w-full">
          <Button variant={'outline'} className="w-full">
            Decline
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FriendRequest;
