import { detectLanguage } from '@/utils/common';
import { IProfilePageProps } from '../ProfilePageContainer';
import { Skeleton } from '@/components/ui/skeleton';
import { Code, CodeBlock } from '@/components/animate-ui/components/animate/code';
import { useTranslation } from 'react-i18next';
import { CountingNumber } from '@/components/animate-ui/primitives/texts/counting-number';
import { formatDateFromISOString, formatWebsiteUrl, normalizeWebsiteUrl } from '@/lib/utils';
import {
  LinkMinimalistic2,
  Calendar,
  Case,
  SquareAcademicCap,
} from '@solar-icons/react-perf/BoldDuotone';
import Link from 'next/link';

interface StatItemProps {
  value: number;
  label: string;
  isLoading?: boolean;
}

const StatItem = ({ value, label, isLoading }: StatItemProps) => {
  if (isLoading) {
    return <Skeleton className="h-4 w-16" />;
  }
  return (
    <span className="text-xs text-foreground/70 cursor-pointer hover:text-foreground transition-colors">
      <CountingNumber number={value} className="font-semibold text-foreground" />{' '}
      <span className="text-foreground/50">{label}</span>
    </span>
  );
};

const Info = ({ isLoading, data }: IProfilePageProps) => {
  const { t } = useTranslation('profile');

  return (
    <>
      <div className="mt-3">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-14 w-full" />
          </div>
        ) : (
          <>
            {data?.bio && (
              <Code code={data.bio} className="border-none">
                <CodeBlock
                  className="max-h-[200px] px-0 pb-4 pt-1 custom-bg-1 transition-none"
                  cursor={true}
                  lang={detectLanguage(data.bio)}
                  writing={true}
                />
              </Code>
            )}
          </>
        )}
      </div>

      {isLoading ? (
        <div className="flex gap-1 flex-col mt-2 max-w-full">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      ) : (
        <div className="flex flex-col gap-1 mt-2 max-w-full">
          {(() => {
            const jobTitle = data?.introduce?.jobTitle?.trim();
            const company = data?.introduce?.company?.trim();

            if (jobTitle && company) {
              return (
                <p className="text-xs text-foreground/60 leading-relaxed flex flex-wrap items-center gap-1">
                  <Case className="w-3.5 h-3.5 text-foreground/40" />
                  <span className="font-medium text-foreground/80 hover:text-foreground cursor-pointer truncate max-w-[200px]">
                    {jobTitle}
                  </span>
                  <span className="text-foreground/40">{t('at')}</span>
                  <span className="font-medium text-foreground/80 hover:text-foreground cursor-pointer truncate max-w-[200px]">
                    {company}
                  </span>
                </p>
              );
            }

            if (jobTitle && !company) {
              return (
                <p className="text-xs text-foreground/60 leading-relaxed flex flex-wrap items-center gap-1">
                  <Case className="w-3.5 h-3.5 text-foreground/40" />
                  <span className="text-foreground/40">{t('works_as')}</span>
                  <span className="font-medium text-foreground/80 hover:text-foreground cursor-pointer truncate max-w-[200px]">
                    {jobTitle}
                  </span>
                </p>
              );
            }

            if (!jobTitle && company) {
              return (
                <p className="text-xs text-foreground/60 leading-relaxed flex flex-wrap items-center gap-1">
                  <Case className="w-3.5 h-3.5 text-foreground/40" />
                  <span className="text-foreground/40">{t('works_at')}</span>
                  <span className="font-medium text-foreground/80 hover:text-foreground cursor-pointer truncate max-w-[200px]">
                    {company}
                  </span>
                </p>
              );
            }

            return null;
          })()}

          {data?.introduce?.school?.trim() && (
            <p className="text-xs text-foreground/60 leading-relaxed flex flex-wrap items-center gap-1">
              <SquareAcademicCap className="w-3.5 h-3.5 text-foreground/40" />
              <span className="text-foreground/40">{t('studied_at')}</span>
              <span className="font-medium text-foreground/80 hover:text-foreground cursor-pointer truncate max-w-[250px]">
                {data.introduce.school}
              </span>
            </p>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-wrap items-center gap-4  mt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
          {data?.introduce?.websiteUrl && (
            <Link
              title={formatWebsiteUrl(data.introduce.websiteUrl)}
              href={normalizeWebsiteUrl(data.introduce.websiteUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-foreground/60 hover:text-foreground flex items-center gap-1 group"
            >
              <LinkMinimalistic2 className="text-link group-hover:text-link" />
              <span className="truncate max-w-[180px] font-medium text-link group-hover:text-link hover:underline">
                {formatWebsiteUrl(data.introduce.websiteUrl)}
              </span>
            </Link>
          )}
          {data?.createdDate && (
            <span className="text-xs text-foreground/50 flex items-center gap-1">
              <Calendar />
              <span className="text-foreground/40">
                {t('joined')}{' '}
                <span className="font-medium text-foreground/60">
                  {formatDateFromISOString(data.createdDate)}
                </span>
              </span>
            </span>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-start gap-2 mt-3">
        <StatItem value={80} label={t('posts') || 'posts'} isLoading={isLoading} />
        <span className="text-foreground/20">·</span>
        <StatItem value={230000} label={t('followers') || 'followers'} isLoading={isLoading} />
        <span className="text-foreground/20">·</span>
        <StatItem value={150} label={t('following') || 'following'} isLoading={isLoading} />
      </div>
    </>
  );
};

export default Info;
