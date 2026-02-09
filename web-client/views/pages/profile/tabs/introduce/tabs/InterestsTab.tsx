'use client';

import { useMemo } from 'react';
import { IDetailUserProfileDTO } from '@/types/profile';
import { useTranslation } from 'react-i18next';
import { hexToRgba } from '@/utils/common';
import { EditInterestsPopover } from '../components/EditInterestsPopover';
import { PenNewSquare } from '@solar-icons/react-perf/Outline';
import { IconButton } from '@/components/animate-ui/components/buttons/icon';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Stars } from '@solar-icons/react-perf/BoldDuotone';

interface IInterestsTabProps {
  data?: IDetailUserProfileDTO;
  isOwner?: boolean;
}

export const InterestsTab = ({ data, isOwner = false }: IInterestsTabProps) => {
  const { t } = useTranslation('profile');
  const introduce = data?.introduce;

  const selectedInterests = useMemo(() => {
    return introduce?.interests || [];
  }, [introduce?.interests]);

  const handleSaveInterests = async (interestIds: string[]) => {
    try {
      // TODO: Implement API call to save interests
      // Example: await api.post(API_ENDPOINTS.PROFILE.UPDATE_INTERESTS, { interestIds });
      console.log('Saving interests:', interestIds);

      toast.success(t('profile:interests_saved', 'Interests saved successfully'));
    } catch (error) {
      console.error('Failed to save interests:', error);
      toast.error(t('profile:interests_save_error', 'Failed to save interests'));
    }
  };

  if (!selectedInterests || selectedInterests.length === 0) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between py-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-foreground/90">
              {t('navigation.interests', 'Interests')}
            </p>
            <p className="text-xs text-muted-foreground">
              {isOwner
                ? t(
                    'profile:add_interests_hint',
                    'Add your interests to let others know what you like',
                  )
                : t('profile:no_interests_yet', 'No interests added yet')}
            </p>
          </div>
          {isOwner && (
            <EditInterestsPopover
              selectedInterests={[]}
              onSave={handleSaveInterests}
              trigger={
                <IconButton
                  variant="outline"
                  className={cn(
                    'transition-colors duration-200',
                    'hover:bg-primary hover:text-primary-foreground',
                    'cursor-pointer',
                  )}
                  title={t('profile:add_interests', 'Add Interests')}
                >
                  <PenNewSquare className="size-4" />
                </IconButton>
              }
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground/60 flex items-center gap-2">
            <Stars className="size-4" />
            {t('navigation.interests', 'Interests')}
          </p>
          <p className="text-xs text-muted-foreground">
            {selectedInterests.length} {t('navigation.interests', 'Interests')}
          </p>
        </div>
        {isOwner && (
          <EditInterestsPopover
            selectedInterests={selectedInterests}
            onSave={handleSaveInterests}
            trigger={
              <IconButton
                variant="default"
                className={cn('transition-colors duration-200', 'cursor-pointer')}
                title={t('profile:edit_interests', 'Edit Interests')}
              >
                <PenNewSquare className="size-4" />
              </IconButton>
            }
          />
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {selectedInterests.map(interest => (
          <div
            key={interest.id}
            className={cn(
              'group flex items-center gap-1.5 rounded-full px-2.5 py-1',
              'border transition-colors duration-200',
              'cursor-default',
              'hover:opacity-90',
            )}
            style={{
              borderColor: hexToRgba(interest.color, 0.3),
              backgroundColor: hexToRgba(interest.color, 0.1),
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = hexToRgba(interest.color, 0.15);
              e.currentTarget.style.borderColor = hexToRgba(interest.color, 0.4);
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = hexToRgba(interest.color, 0.1);
              e.currentTarget.style.borderColor = hexToRgba(interest.color, 0.3);
            }}
          >
            <div
              className="size-2 rounded-full shrink-0"
              style={{ backgroundColor: interest.color }}
            />
            <span className="text-xs font-medium leading-tight" style={{ color: interest.color }}>
              {interest.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
