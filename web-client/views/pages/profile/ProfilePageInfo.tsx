import { detectLanguage } from '@/utils/common';
import { IProfilePageProps } from './ProfilePage';
import { Skeleton } from '@/components/customs/skeleton';
import { Code, CodeBlock } from '@/components/animate-ui/components/animate/code';
import { useTranslation } from 'react-i18next';
import { CountingNumber } from '@/components/animate-ui/primitives/texts/counting-number';

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
      <CountingNumber number={value} className="font-medium text-gray-500 dark:text-white" />{' '}
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
    </span>
  );
};

const ProfilePageInfo = ({ isLoading, data }: IProfilePageProps) => {
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
                  className="max-h-[200px]"
                  cursor={false}
                  lang={detectLanguage(data.bio)}
                  writing={true}
                />
              </Code>
            )}
          </>
        )}
      </div>

      {/* Technology Badges */}
      {!isLoading && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <div className="px-3 py-1.5 rounded-lg bg-[#f89820]/10 dark:bg-[#f89820]/20 border border-[#f89820]/30">
            <span className="text-xs font-medium text-[#f89820]">☕ Java</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#61dafb]/10 dark:bg-[#61dafb]/20 border border-[#61dafb]/30">
            <span className="text-xs font-medium text-[#61dafb]">⚛️ React</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#6db33f]/10 dark:bg-[#6db33f]/20 border border-[#6db33f]/30">
            <span className="text-xs font-medium text-[#6db33f]">🍃 Spring Boot</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#2496ed]/10 dark:bg-[#2496ed]/20 border border-[#2496ed]/30">
            <span className="text-xs font-medium text-[#2496ed]">🐳 Docker</span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center md:justify-start justify-center md:gap-4 gap-1 mt-2">
        <StatItem value={80} label={t('posts') || 'posts'} isLoading={isLoading} />
        <span className="text-gray-300 dark:text-gray-600">·</span>
        <StatItem value={230000} label={t('followers') || 'followers'} isLoading={isLoading} />
        <span className="text-gray-300 dark:text-gray-600">·</span>
        <StatItem value={150} label={t('following') || 'following'} isLoading={isLoading} />
      </div>
    </>
  );
};

export default ProfilePageInfo;
