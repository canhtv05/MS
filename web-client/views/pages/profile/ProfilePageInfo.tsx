import { detectLanguage } from '@/utils/common';
import Link from 'next/link';
import { formatNumberString } from '@/lib/utils';
import { IProfilePageProps } from './ProfilePage';
import { Skeleton } from '@/components/customs/skeleton';
import { Code, CodeBlock } from '@/components/animate-ui/components/animate/code';
import { Calendar, LinkMinimalistic2, MapPointWave } from '@solar-icons/react-perf/Outline';

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
              <p className="">@{data?.data?.userId}</p>
            </div>
          </div>
        )}

        {!isLoading &&
          (data?.data?.city ||
            data?.data?.tiktokUrl ||
            data?.data?.facebookUrl ||
            data?.data?.instagramUrl ||
            data?.data?.createdDate) && (
            <div className="flex flex-wrap flex-col items-start gap-x-4 gap-y-1 pt-1">
              <div className="flex gap-2 group items-center flex-wrap justify-start">
                {data?.data?.city && (
                  <div className="text-xs group text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5">
                    <MapPointWave size={14} className="shrink-0" />
                    <p className="max-w-[250px] md:max-w-[300px] text-xs truncate">
                      {data.data.city}
                    </p>
                  </div>
                )}

                {data?.data?.createdDate && (
                  <div className="text-xs group text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5">
                    <Calendar size={14} className="shrink-0" />
                    <span className="text-xs">{data.data.createdDate.substring(0, 10)}</span>
                  </div>
                )}
              </div>

              {data?.data?.tiktokUrl && (
                <Link
                  target="_blank"
                  href={data.data.tiktokUrl}
                  className="text-xs hover:underline font-medium flex items-center gap-1.5 group"
                >
                  <LinkMinimalistic2 size={14} className="shrink-0" />
                  <span className="max-w-[250px] md:max-w-[300px] truncate text-gray-500 dark:text-gray-400">
                    {data.data.tiktokUrl.replace(/^https?:\/\/(www\.)?/, '')}
                  </span>
                </Link>
              )}

              {data?.data?.facebookUrl && (
                <Link
                  target="_blank"
                  href={data.data.facebookUrl}
                  className="text-xs hover:underline font-medium flex items-center gap-1.5 group"
                >
                  <LinkMinimalistic2 size={14} className="shrink-0" />
                  <span className="max-w-[250px] md:max-w-[300px] truncate text-gray-500 dark:text-gray-400">
                    {data.data.facebookUrl.replace(/^https?:\/\/(www\.)?/, '')}
                  </span>
                </Link>
              )}

              {data?.data?.instagramUrl && (
                <Link
                  target="_blank"
                  href={data.data.instagramUrl}
                  className="text-xs hover:underline font-medium flex items-center gap-1.5 group"
                >
                  <LinkMinimalistic2 size={14} className="shrink-0" />
                  <span className="max-w-[250px] md:max-w-[300px] truncate text-gray-500 dark:text-gray-400">
                    {data.data.instagramUrl.replace(/^https?:\/\/(www\.)?/, '')}
                  </span>
                </Link>
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
        {isLoading || !data?.data?.bio ? (
          data?.data?.bio && (
            <div className="space-y-2">
              <Skeleton className="h-14 w-full" />
            </div>
          )
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
