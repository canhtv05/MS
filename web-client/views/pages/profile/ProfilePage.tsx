'use client';

import { IProfileParams } from '@/app/(home)/[username]/page';
import { MapPinIcon } from '@/components/animate-ui/icons/map-pin';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/customs/avatar';
import images from '@/public/imgs';
import Image from 'next/image';
import useProfile from './use-profile';
import { use } from 'react';
import { AtSignIcon } from '@/components/animate-ui/icons/at-sign';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { AddUserIcon, Mail2Icon } from '@/components/animate-ui/icons/common';

const ProfilePage = ({ params }: { params: Promise<IProfileParams> }) => {
  const { username } = use(params);
  const decodedUsername = decodeURIComponent(username);
  const { data } = useProfile({ username: decodedUsername });

  if (!decodedUsername.startsWith('@')) {
    return (
      <div className="p-4">
        <h1 className="text-red-500 font-bold">Profile Not Found</h1>
        <p>You tried to access: {decodedUsername}</p>
        <p>We expected a username starting with @</p>
        <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded mt-2 text-xs">
          DEBUG INFO: params.username: {decodedUsername}
          decoded: {decodedUsername}
        </pre>
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-800 h-full mb-8 w-full shadow-[0_0_10px_0_rgba(0,0,0,0.07)] lg:block inline-flex flex-col lg:w-full bg-white p-4 rounded-lg">
      <div className="relative w-full h-[150px]">
        <Image
          src={
            'https://thumbs.dreamstime.com/b/incredibly-beautiful-sunset-sun-lake-sunrise-landscape-panorama-nature-sky-amazing-colorful-clouds-fantasy-design-115177001.jpg'
          }
          alt="bg"
          fill
          className="object-cover rounded-md"
          loading="eager"
        />

        <div className="absolute -bottom-20 left-5 flex items-end gap-5 w-full pr-5">
          <Avatar className="w-28 h-28">
            <AvatarImage
              width={100}
              height={100}
              className="rounded-full border-4 border-purple-300 cursor-pointer"
              src={images.avt1.src}
              alt={'avt1'}
            />
            <AvatarFallback>{'avt1'.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="group flex items-center justify-between gap-1 w-full">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {data?.data?.fullname}
              </h2>
              <div className="text-sm text-gray-500 font-medium flex items-center gap-1">
                <AtSignIcon size={12} />
                <p>{data?.data?.userId}</p>
              </div>
              <div className="text-sm text-gray-500 font-medium flex items-center gap-1">
                <MapPinIcon size={12} className="group-hover:animate-icon" />
                <p>{data?.data?.city}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Mail2Icon />
                Message
              </Button>
              <Button variant="default">
                <AddUserIcon />
                Follow
              </Button>
            </div>
          </div>
        </div>
      </div>
      <p className="pt-24 pl-5">{data?.data?.bio}</p>
    </div>
  );
};

export default ProfilePage;
