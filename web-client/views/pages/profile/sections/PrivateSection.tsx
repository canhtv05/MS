'use client';

import { IDetailUserProfileDTO } from '@/types/profile';
import { useTranslation } from 'react-i18next';
import { User } from '@solar-icons/react-perf/BoldDuotone';
import { PrivacyLevel } from '@/enums/common';
import { Skeleton } from '@/components/customs/skeleton';
import { ShieldUser } from '@solar-icons/react-perf/BoldDuotone';
import Show from '@/components/Show';
import { useState } from 'react';
import Dialog from '@/components/customs/dialog';
import { useAuthStore } from '@/stores/auth';
import Image from 'next/image';
import images from '@/public/imgs';

interface IPrivateSectionProps {
  data?: IDetailUserProfileDTO;
  isLoading?: boolean;
}

const PrivateSection = ({ data, isLoading }: IPrivateSectionProps) => {
  const { user } = useAuthStore();
  const { t } = useTranslation('profile');
  const privacy = data?.privacy;
  const [showDetail, setShowDetail] = useState(false);

  if (!privacy) return null;

  return (
    <>
      <Show
        when={privacy && !isLoading}
        fallback={
          <div className="flex gap-(--sp-layout)">
            <Skeleton className="h-10 w-full flex-1" />
            <Skeleton className="h-10 w-full flex-4" />
          </div>
        }
      >
        <div className="flex flex-col gap-2">
          <Show
            when={
              privacy.profileVisibility &&
              privacy.profileVisibility === PrivacyLevel.PRIVACY_LEVEL_PRIVATE
            }
          >
            <div className="flex items-center gap-2 text-xs text-foreground/60 group">
              <ShieldUser className="sm:size-14 size-10 text-primary" />
              <div className="flex flex-col items-start">
                {(() => {
                  const isOwner = user?.auth?.username === data?.userId;
                  const displayName = isOwner ? t('private_you') : data?.fullname;
                  return (
                    <>
                      <span className="max-w-full wrap-break-word font-black text-sm sm:text-sm">
                        {t('private_locked_title', { displayName })}
                      </span>
                      <span className="max-w-full wrap-break-word font-medium text-xs">
                        {t('private_mode_label')}{' '}
                        {t(`common:privacy_level.${privacy.profileVisibility}`)}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowDetail(true)}
                        className="text-link text-xs cursor-pointer"
                      >
                        {t('private_view_detail')}
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>
          </Show>
          <Show
            when={
              privacy.profileVisibility &&
              privacy.profileVisibility === PrivacyLevel.PRIVACY_LEVEL_FRIENDS_ONLY
            }
          >
            <div className="flex items-center gap-2 text-xs text-foreground/60 group">
              <User className="w-3.5 h-3.5 text-foreground/40" />
              <span className="truncate max-w-full font-medium">
                {t(`common:privacy_level.${privacy.profileVisibility}`)}
              </span>
              <button
                type="button"
                onClick={() => setShowDetail(true)}
                className="text-link text-xs cursor-pointer"
              >
                {t('private_view_detail')}
              </button>
            </div>
          </Show>
        </div>
      </Show>
      <Dialog
        disableFooter
        open={showDetail}
        onClose={() => setShowDetail(false)}
        title={t('private_dialog_title')}
      >
        <div className="flex flex-col gap-3 text-xs text-foreground/80">
          <div className="w-full h-32 rounded-lg bg-muted/60 flex items-center justify-center text-[10px] text-foreground/50 mb-1">
            <Image
              src={images.privateBg}
              alt="private-bg"
              width={100}
              height={100}
              unoptimized
              className="w-full h-full object-cover"
            />
          </div>

          {privacy.profileVisibility === PrivacyLevel.PRIVACY_LEVEL_PRIVATE && (
            <>
              <p className="font-semibold text-foreground text-sm">
                {t('private_private_heading')}
              </p>
              <p>{t('private_private_p1')}</p>
              <p className="font-medium mt-1">{t('private_private_how_title')}</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>{t('private_private_li1')}</li>
                <li>{t('private_private_li2')}</li>
                <li>{t('private_private_li3')}</li>
              </ul>
            </>
          )}

          {privacy.profileVisibility === PrivacyLevel.PRIVACY_LEVEL_FRIENDS_ONLY && (
            <>
              <p className="font-semibold text-foreground text-sm">
                {t('private_friends_heading')}
              </p>
              <p>{t('private_friends_p1')}</p>
              <p className="font-medium mt-1">{t('private_friends_how_title')}</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>{t('private_friends_li1')}</li>
                <li>{t('private_friends_li2')}</li>
                <li>{t('private_friends_li3')}</li>
              </ul>
            </>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default PrivateSection;
