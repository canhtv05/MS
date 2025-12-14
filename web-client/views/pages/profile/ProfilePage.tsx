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
import { Code, CodeBlock } from '@/components/animate-ui/components/animate/code';
import { AxiosError } from 'axios';
import { ErrorMessage } from '@/enums/error-message';
import { IconButton } from '@/components/animate-ui/components/buttons/icon';
import {
  Tooltip,
  TooltipPanel,
  TooltipTrigger,
} from '@/components/animate-ui/components/base/tooltip';
import { useTranslation } from 'react-i18next';
import { detectLanguage } from '@/utils/common';
import Link from 'next/link';
import { LinkIcon } from '@/components/animate-ui/icons/link';
import { AnimateIcon } from '@/components/animate-ui/icons/icon';
import { CalendarDaysIcon } from '@/components/animate-ui/icons/calendar-day';
import { formatNumberString } from '@/lib/utils';

const ProfilePage = ({ params }: { params: Promise<IProfileParams> }) => {
  const { username } = use(params);
  const decodedUsername = decodeURIComponent(username);
  const { data, isLoading, error } = useProfile({ username: decodedUsername });
  const { t } = useTranslation('profile');

  if (!decodedUsername.startsWith('@')) {
    return (
      <div className="p-4">
        <h1 className="text-red-500 font-bold">{t('profile_not_found')}</h1>
        <p>
          {t('you_tried_to_access')} {decodedUsername}
        </p>
        <p>{t('expected_username_starting_with')}</p>
        <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded mt-2 text-xs">
          DEBUG INFO: params.username: {decodedUsername}
          decoded: {decodedUsername}
        </pre>
      </div>
    );
  }

  if (error instanceof AxiosError) {
    if (error!.response!.data.code == ErrorMessage.USER_PROFILE_NOT_FOUND) {
      return <div>{t('user_not_found')}</div>;
    }
  }

  return (
    <div className="h-full w-full shadow-[0_0_10px_0_rgba(0,0,0,0.07)] lg:block inline-flex bg-white dark:bg-gray-800 flex-col lg:w-full rounded-lg">
      <div className="relative w-full h-[200px]!">
        <Image
          src={
            'https://thumbs.dreamstime.com/b/incredibly-beautiful-sunset-sun-lake-sunrise-landscape-panorama-nature-sky-amazing-colorful-clouds-fantasy-design-115177001.jpg'
          }
          alt="bg"
          fill
          className="object-cover rounded-t-md"
          loading="eager"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
      </div>

      <div className="px-6 pb-6 dark:bg-gray-800 bg-white rounded-b-lg">
        <div className="flex items-end gap-5 -mt-16">
          {isLoading && !data?.data ? (
            <div className="w-32 h-32 rounded-full shrink-0 relative border-4 border-white dark:border-gray-800 shadow-lg before:absolute before:inset-0 before:bg-white dark:before:bg-gray-800 before:rounded-full before:z-0">
              <Skeleton className="w-full h-full rounded-full relative z-10" />
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
            {isLoading && !data?.data ? (
              <>
                <div className="md:flex hidden items-center justify-center gap-2">
                  <Skeleton className="h-10 w-[110px] rounded-md" />
                  <Skeleton className="h-10 w-[100px] rounded-md" />
                </div>
                <div className="md:hidden flex items-center justify-center gap-2">
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <Skeleton className="h-9 w-9 rounded-md" />
                </div>
              </>
            ) : (
              <>
                <div className="md:flex hidden items-center justify-center gap-2">
                  <Button variant="outline" className="gap-2">
                    <Mail2Icon />
                    {t('message')}
                  </Button>
                  <Button variant="default" className="gap-2">
                    <AddUserIcon />
                    {t('follow')}
                  </Button>
                </div>

                <div className="md:hidden flex items-center justify-center gap-2">
                  {[
                    { icon: Mail2Icon, variant: 'outline' as const, text: t('message') },
                    { icon: AddUserIcon, variant: 'default' as const, text: t('follow') },
                  ].map(({ icon: Icon, variant, text }, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <IconButton className="cursor-pointer shadow-none" variant={variant}>
                          <Icon />
                        </IconButton>
                      </TooltipTrigger>
                      <TooltipPanel
                        side={'top'}
                        transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <span className="text-white/70">{text}</span>
                      </TooltipPanel>
                    </Tooltip>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {isLoading && !data?.data ? (
            <Skeleton className="h-7 w-[200px]" />
          ) : (
            <div className="flex items-end justify-start gap-2">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white leading-7">
                {data?.data?.fullname}
              </h2>
              <div className="text-sm group text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5">
                <AtSignIcon size={14} className="shrink-0" />
                <p className="leading-5">{data?.data?.userId}</p>
              </div>
            </div>
          )}

          {!isLoading &&
            (data?.data?.city ||
              data?.data?.tiktokUrl ||
              data?.data?.fbUrl ||
              data?.data?.createdDate) && (
              <div className="flex flex-wrap flex-col items-start gap-x-4 gap-y-1 pt-1">
                <div className="flex gap-2 group items-center flex-wrap justify-start">
                  {data?.data?.city && (
                    <div className="text-sm group text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5">
                      <MapPinIcon size={14} className="shrink-0" />
                      <p className="leading-5 max-w-[250px] md:max-w-full text-sm truncate">
                        {data.data.city}
                      </p>
                    </div>
                  )}

                  {data?.data?.createdDate && (
                    <div className="text-sm group text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5">
                      <CalendarDaysIcon size={14} className="shrink-0]" />
                      <p className="leading-5 text-sm">{data.data.createdDate.substring(0, 10)}</p>
                    </div>
                  )}
                </div>

                {data?.data?.tiktokUrl && (
                  <AnimateIcon animateOnHover>
                    <Link
                      target="_blank"
                      href={data.data.tiktokUrl}
                      className="text-sm hover:underline font-medium flex items-center gap-1.5 group"
                    >
                      <LinkIcon size={14} className="shrink-0" />
                      <span className="leading-5 max-w-[200px] truncate">
                        {data.data.tiktokUrl.replace(/^https?:\/\/(www\.)?/, '')}
                      </span>
                    </Link>
                  </AnimateIcon>
                )}

                {data?.data?.fbUrl && (
                  <AnimateIcon animateOnHover>
                    <Link
                      target="_blank"
                      href={data.data.fbUrl}
                      className="text-sm hover:underline font-medium flex items-center gap-1.5 group"
                    >
                      <LinkIcon size={14} className="shrink-0" />
                      <span className="leading-5 max-w-[200px] truncate">
                        {data.data.fbUrl.replace(/^https?:\/\/(www\.)?/, '')}
                      </span>
                    </Link>
                  </AnimateIcon>
                )}
              </div>
            )}
          {isLoading && (
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Skeleton className="h-5 w-[120px]" />
              <Skeleton className="h-5 w-[150px]" />
              <Skeleton className="h-5 w-[100px]" />
            </div>
          )}
        </div>

        <div className="mt-3">
          {isLoading || !data?.data?.bio || data.data.bio.trim() === '' ? (
            <div className="space-y-2">
              <Skeleton className="h-14 w-full" />
            </div>
          ) : (
            <Code code={data.data.bio}>
              <CodeBlock
                className="max-h-[200px]"
                cursor={false}
                lang={detectLanguage(data.data.bio)}
                writing={false}
              />
            </Code>
          )}
        </div>

        <div className="flex mt-4 items-center justify-start gap-6">
          {isLoading ? (
            <>
              <div className="flex flex-col items-center justify-start gap-1">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex flex-col items-center justify-start gap-1">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex flex-col items-center justify-start gap-1">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-4 w-20" />
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center justify-start">
                <strong className="font-bold text-gray-800 dark:text-white">
                  {formatNumberString(0)}
                </strong>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('posts')}</p>
              </div>
              <div className="flex flex-col items-center justify-start">
                <strong className="font-bold text-gray-800 dark:text-white">
                  {formatNumberString(0)}
                </strong>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('followers')}</p>
              </div>
              <div className="flex flex-col items-center justify-start">
                <strong className="font-bold text-gray-800 dark:text-white">
                  {formatNumberString(0)}
                </strong>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('following')}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
