'use client';

import {
  Select,
  SelectArrow,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/animate-ui/components/radix/select';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const Privacy = () => {
  const { t } = useTranslation('settings');
  const [profileVisibility, setProfileVisibility] = useState<string>('next');

  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold">{t('privacy.title')}</h1>
      <div className="flex flex-col gap-4 mt-5 p-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold">{t('privacy.profile_visibility.title')}</h2>
            <p className="text-sm text-gray-500">{t('privacy.profile_visibility.description')}</p>
          </div>
          <Select value={profileVisibility} onValueChange={setProfileVisibility}>
            <SelectTrigger className="w-full transition-global border-gray-200 bg-white/50 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/50">
              <SelectValue placeholder="Select a framework" />
            </SelectTrigger>
            <SelectContent className="z-[100]">
              <SelectArrow />
              <SelectGroup>
                <SelectLabel>Frameworks</SelectLabel>
                <SelectItem value="next">Next.js</SelectItem>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="vue">Vue</SelectItem>
                <SelectItem value="angular">Angular</SelectItem>
                <SelectItem value="svelte">Svelte</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-bold">{t('privacy.friends_visibility.title')}</h2>
          <p className="text-sm text-gray-500">{t('privacy.friends_visibility.description')}</p>
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-bold">{t('privacy.posts_visibility.title')}</h2>
          <p className="text-sm text-gray-500">{t('privacy.posts_visibility.description')}</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
