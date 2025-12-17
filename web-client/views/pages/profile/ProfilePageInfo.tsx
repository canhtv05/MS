import { detectLanguage } from '@/utils/common';
import Link from 'next/link';
import { LinkIcon } from '@/components/animate-ui/icons/link';
import { AnimateIcon } from '@/components/animate-ui/icons/icon';
import { CalendarDaysIcon } from '@/components/animate-ui/icons/calendar-day';
import { formatNumberString } from '@/lib/utils';
import { IProfilePageProps } from './ProfilePage';
import { Skeleton } from '@/components/customs/skeleton';
import { AtSignIcon } from '@/components/animate-ui/icons/at-sign';
import { MapPinIcon } from '@/components/animate-ui/icons/map-pin';
import { Code, CodeBlock } from '@/components/animate-ui/components/animate/code';

interface StatItemProps {
  value: number;
  label: string;
  isLoading?: boolean;
}

const StatItem = ({ value, label, isLoading }: StatItemProps) => {
  if (isLoading) {
    return <Skeleton className="h-5 w-20" />;
  }
  return (
    <span className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-800 dark:hover:text-white transition-colors">
      <strong className="font-bold text-gray-800 dark:text-white">
        {formatNumberString(value)}
      </strong>{' '}
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
    </span>
  );
};

const ProfilePageInfo = ({ isLoading, t, data }: IProfilePageProps) => {
  return (
    <>
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
                    <span className="leading-5 max-w-[200px] truncate text-gray-500 dark:text-gray-400">
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
                    <span className="leading-5 max-w-[200px] truncate text-gray-500 dark:text-gray-400">
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

      <div className="flex flex-wrap items-center md:gap-4 gap-1 mt-2">
        <StatItem value={80} label={t?.('posts') || 'posts'} isLoading={isLoading} />
        <span className="text-gray-300 dark:text-gray-600">·</span>
        <StatItem value={2300} label={t?.('followers') || 'followers'} isLoading={isLoading} />
        <span className="text-gray-300 dark:text-gray-600">·</span>
        <StatItem value={150} label={t?.('following') || 'following'} isLoading={isLoading} />
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
    </>
  );
};

export default ProfilePageInfo;
