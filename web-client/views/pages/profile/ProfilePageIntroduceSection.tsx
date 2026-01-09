'use client';

import { IDetailUserProfileDTO } from '@/types/profile';
import { useTranslation } from 'react-i18next';
import {
  User,
  MapPoint,
  Donut,
  Smartphone,
  MapPointWave,
} from '@solar-icons/react-perf/BoldDuotone';
import { Heart } from '@solar-icons/react-perf/Bold';
import { Gender, RelationshipStatus } from '@/enums/common';
import { formatDateFromISOString } from '@/lib/utils';
import { Skeleton } from '@/components/customs/skeleton';

interface IProfilePageIntroduceSectionProps {
  data?: IDetailUserProfileDTO;
  isLoading?: boolean;
}

const ProfilePageIntroduceSection = ({ data, isLoading }: IProfilePageIntroduceSectionProps) => {
  const { t } = useTranslation('profile');
  const introduce = data?.introduce;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 mt-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    );
  }

  if (!introduce) return null;

  return (
    <div className="flex flex-col gap-2 mt-2">
      {introduce.relationshipStatus &&
        introduce.relationshipStatus !== RelationshipStatus.RELATIONSHIP_STATUS_UNSPECIFIED && (
          <div className="flex items-center gap-2 text-xs text-foreground/60 group">
            <Heart className="w-3.5 h-3.5 text-foreground/40" />
            <span className="truncate max-w-full font-medium">
              {t(introduce.relationshipStatus)}
            </span>
          </div>
        )}

      {introduce.gender && introduce.gender !== Gender.GENDER_UNSPECIFIED && (
        <div className="flex items-center gap-2 text-xs text-foreground/60 group">
          <User className="w-3.5 h-3.5 text-foreground/40" />
          <span className="truncate max-w-full font-medium">{t(introduce.gender)}</span>
        </div>
      )}
      {introduce.city && (
        <div className="flex items-center gap-2 text-xs text-foreground/60 group">
          <MapPointWave className="w-3.5 h-3.5 text-foreground/40" />
          <span className="truncate max-w-full flex-1">
            <span className="text-foreground/40">{t('lives_in')}</span>{' '}
            <span className="font-medium">{introduce.city}</span>
          </span>
        </div>
      )}
      {introduce.hometown && (
        <div className="flex items-center gap-2 text-xs text-foreground/60 group">
          <MapPoint className="w-3.5 h-3.5 text-foreground/40" />
          <span className="truncate max-w-full flex-1">
            <span className="text-foreground/40">{t('from')}</span>{' '}
            <span className="font-medium">{introduce.hometown}</span>
          </span>
        </div>
      )}
      {introduce.dob && (
        <div className="flex items-center gap-2 text-xs text-foreground/60 group">
          <Donut className="w-3.5 h-3.5 text-foreground/40" />
          <span className="truncate max-w-full">
            <span className="text-foreground/40">{t('birthday')}: </span>
            <span className="font-medium">
              {formatDateFromISOString(introduce.dob).split(' ')[0]}
            </span>
          </span>
        </div>
      )}
      {introduce.phoneNumber && (
        <div className="flex items-center gap-2 text-xs text-foreground/60 group">
          <Smartphone className="w-3.5 h-3.5 text-foreground/40" />
          <span className="truncate max-w-full">
            <span className="text-foreground/40">{t('phone')}: </span>
            <span className="font-medium">{introduce.phoneNumber}</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default ProfilePageIntroduceSection;
