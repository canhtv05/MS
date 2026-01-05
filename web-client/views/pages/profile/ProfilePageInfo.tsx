import { detectLanguage } from '@/utils/common';
import { IProfilePageProps } from './ProfilePage';
import { Skeleton } from '@/components/customs/skeleton';
import { Code, CodeBlock } from '@/components/animate-ui/components/animate/code';
import { useTranslation } from 'react-i18next';
import { CountingNumber } from '@/components/animate-ui/primitives/texts/counting-number';
import { MapPointWave, LinkMinimalistic2 } from '@solar-icons/react-perf/Outline';
import Link from 'next/link';

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
      <strong className="">
        <CountingNumber number={value} className="font-bold text-gray-800 dark:text-white" />
      </strong>{' '}
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
    </span>
  );
};

const ProfilePageInfo = ({ isLoading, data }: IProfilePageProps) => {
  const { t } = useTranslation('profile');

  // Fake data matching the UI design
  const fakeData = {
    jobTitle: 'Senior Backend Engineer',
    company: 'LeafHub',
    school: 'Bách Khoa',
    city: 'Hà Nội',
    websiteUrl: 'https://canhtv.com',
    githubUrl: 'https://github.com/canhtv',
    linkedinUrl: 'https://linkedin.com/in/canhtv',
    facebookUrl: 'https://facebook.com/canhtv',
    xUrl: 'https://x.com/canhtv',
  };

  return (
    <>
      <div className="mt-4 space-y-3">
        {!isLoading && (
          <div className="flex flex-wrap flex-col items-start gap-x-4 gap-y-1 pt-1">
            <div className="flex gap-2 group items-center flex-wrap justify-start">
              {/* Job Info */}
              <div className="text-xs group text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5">
                <MapPointWave size={14} className="shrink-0" />
                <p className="max-w-[250px] md:max-w-[300px] text-xs truncate">
                  {fakeData.jobTitle} tại {fakeData.company}
                </p>
              </div>

              {/* School Info */}
              <div className="text-xs group text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5">
                <MapPointWave size={14} className="shrink-0" />
                <span className="text-xs">Cựu sinh viên {fakeData.school}</span>
              </div>

              {/* Location */}
              <div className="text-xs group text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5">
                <MapPointWave size={14} className="shrink-0" />
                <p className="max-w-[250px] md:max-w-[300px] text-xs truncate">
                  Sống tại {fakeData.city}
                </p>
              </div>
            </div>

            {/* Website Link */}
            <Link
              target="_blank"
              href={fakeData.websiteUrl}
              className="text-xs hover:underline font-medium flex items-center gap-1.5 group"
            >
              <LinkMinimalistic2 size={14} className="shrink-0" />
              <span className="max-w-[250px] md:max-w-[300px] truncate text-gray-500 dark:text-gray-400">
                {fakeData.websiteUrl.replace(/^https?:\/\/(www\.)?/, '')}
              </span>
            </Link>
          </div>
        )}
        {isLoading && (
          <div className="flex flex-col flex-wrap items-start gap-1">
            <Skeleton className="h-5 w-[120px]" />
            <Skeleton className="h-5 w-[150px]" />
            <Skeleton className="h-5 w-[100px]" />
          </div>
        )}
      </div>

      <div className="mt-3">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-14 w-full" />
          </div>
        ) : (
          <>
            {data?.data?.bio && (
              <Code code={data.data.bio}>
                <CodeBlock
                  className="max-h-[200px]"
                  cursor={false}
                  lang={detectLanguage(data.data.bio)}
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
