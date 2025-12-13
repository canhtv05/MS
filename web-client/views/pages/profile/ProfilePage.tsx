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
import { Skeleton } from '@/components/customs/skeleton';

const ProfilePage = ({ params }: { params: Promise<IProfileParams> }) => {
  const { username } = use(params);
  const decodedUsername = decodeURIComponent(username);
  const { data, isLoading } = useProfile({ username: decodedUsername });

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
    <div className="dark:bg-gray-800 h-full mb-8 w-full shadow-[0_0_10px_0_rgba(0,0,0,0.07)] lg:block inline-flex flex-col lg:w-full bg-white rounded-lg overflow-hidden">
      <div className="relative w-full h-[200px]">
        <Image
          src={
            'https://thumbs.dreamstime.com/b/incredibly-beautiful-sunset-sun-lake-sunrise-landscape-panorama-nature-sky-amazing-colorful-clouds-fantasy-design-115177001.jpg'
          }
          alt="bg"
          fill
          className="object-cover"
          loading="eager"
        />
      </div>

      <div className="px-6 pb-6">
        <div className="flex items-end gap-5 -mt-16">
          {isLoading ? (
            <div className="w-32 h-32 rounded-full shrink-0 bg-background border-4 border-white dark:border-gray-800 shadow-lg">
              <Skeleton className="w-full h-full rounded-full" />
            </div>
          ) : (
            <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800 shadow-lg">
              <AvatarImage
                width={128}
                height={128}
                className="rounded-full cursor-pointer"
                src={images.avt1.src}
                alt={data?.data?.fullname}
              />
              <AvatarFallback className="text-2xl font-bold">
                {data?.data?.fullname?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          )}

          <div className="flex items-center gap-2 ml-auto mb-2">
            {isLoading ? (
              <>
                <Skeleton className="h-10 w-[110px] rounded-md" />
                <Skeleton className="h-10 w-[100px] rounded-md" />
              </>
            ) : (
              <>
                <Button variant="outline" className="gap-2">
                  <Mail2Icon />
                  Message
                </Button>
                <Button variant="default" className="gap-2">
                  <AddUserIcon />
                  Follow
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {isLoading ? (
            <Skeleton className="h-7 w-[200px]" />
          ) : (
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white leading-7 truncate">
              {data?.data?.fullname}
            </h2>
          )}

          {isLoading ? (
            <Skeleton className="h-5 w-[150px]" />
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5">
              <AtSignIcon size={14} className="shrink-0" />
              <p className="leading-5 truncate">{data?.data?.userId}</p>
            </div>
          )}

          {isLoading ? (
            <Skeleton className="h-5 w-[120px]" />
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5">
              <MapPinIcon size={14} className="shrink-0" />
              <p className="leading-5 truncate">{data?.data?.city}</p>
            </div>
          )}
        </div>

        <div className="mt-6">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
              {data?.data?.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
