'use client';

import Image from 'next/image';
import useProfile from './use-profile';
import { use } from 'react';
import { AxiosError } from 'axios';
import { ErrorMessage } from '@/enums/error-message';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { IDetailUserProfileDTO } from '@/types/profile';
import Info from './sections/Info';
import Hero from './hero/Hero';
import Tabs from './tabs/Tabs';
import Zoom from 'react-medium-image-zoom';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { CameraMinimalistic } from '@solar-icons/react-perf/BoldDuotone';
import { useAuthStore } from '@/stores/auth';
import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu';
import { Gallery, GallerySend } from '@solar-icons/react-perf/BoldDuotone';
import Dialog from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import ChooseImage from './modals/ChooseImage';
import { getImageSrcOrNull } from '@/lib/image-utils';
import { useProfileModalStore } from './use-profile-modal';
import { IProfileParams } from '@/app/(home)/(feed)/user/[username]/page';
import Show from '@/components/Show';
import { PrivacyLevel } from '@/enums/common';
import { Portal } from 'radix-ui';

export interface IProfilePageProps {
  isLoading: boolean;
  t?: TFunction<'translation', undefined>;
  data?: IDetailUserProfileDTO;
}

const CoverImage = ({ coverSrc, isUploading }: { coverSrc: string; isUploading: boolean }) => {
  const { t } = useTranslation('layout');

  return (
    <div className="relative w-full h-[200px]">
      <Image
        src={coverSrc}
        alt="bg"
        fill
        className="object-cover rounded-t-md"
        loading="eager"
        quality={100}
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 60vw"
        unoptimized
      />
      {isUploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-md">
          <div className="text-white text-sm font-medium">{t('layout:header.uploading')}...</div>
        </div>
      )}
    </div>
  );
};

const ProfilePageContainer = ({ params }: { params: Promise<IProfileParams> }) => {
  const { username } = use(params);
  const decodedUsername = decodeURIComponent(username);
  const { user } = useAuthStore();
  const {
    data,
    isLoading,
    error,
    coverImagePreview,
    handleFileChange,
    triggerFileInput,
    fileInputRef,
    isUploading,
    showConfirmChangeCoverUrl,
    confirmUpload,
    cancelUpload,
    isCoverHistoryDialogOpen,
    openCoverHistoryDialog,
    closeCoverHistoryDialog,
    selectedCoverUrl,
    setSelectedCoverUrl,
    handleChangeCoverFromHistory,
  } = useProfile({
    username: decodedUsername.startsWith('@') ? decodedUsername.slice(1) : decodedUsername,
  });
  const { t } = useTranslation(['profile', 'layout', 'common']);

  if (error instanceof AxiosError) {
    if (error!.response!.data.code == ErrorMessage.USER_PROFILE_NOT_FOUND) {
      return <div>{t('user_not_found')}</div>;
    }
  }

  return (
    <div className="h-full w-full lg:block inline-flex flex-col lg:w-full rounded-lg">
      <div className="relative w-full h-[200px]!">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          name="input-cover-image-ref"
        />
        {(() => {
          if (isLoading) {
            return (
              <div className="relative w-full h-[200px]">
                <Skeleton className="w-full h-full rounded-t-md" />
              </div>
            );
          }

          const isOwnProfile = user?.auth?.username === data?.userId;
          const coverSrc = isOwnProfile
            ? getImageSrcOrNull(coverImagePreview) ||
              getImageSrcOrNull(selectedCoverUrl) ||
              getImageSrcOrNull(data?.coverUrl) ||
              getImageSrcOrNull(user?.profile?.coverUrl)
            : getImageSrcOrNull(data?.coverUrl);

          if (coverSrc && coverSrc.trim() !== '') {
            const visibility = data?.privacy?.profileVisibility;
            const isPrivateCover =
              !isOwnProfile &&
              !!visibility &&
              [
                PrivacyLevel.PRIVACY_LEVEL_PRIVATE,
                PrivacyLevel.PRIVACY_LEVEL_FRIENDS_ONLY,
              ].includes(visibility);
            return (
              <Show
                when={!isPrivateCover}
                fallback={<CoverImage coverSrc={coverSrc} isUploading={isUploading} />}
              >
                <Zoom
                  zoomMargin={20}
                  zoomImg={{
                    src: coverSrc,
                    alt: 'bg',
                  }}
                >
                  <CoverImage coverSrc={coverSrc} isUploading={isUploading} />
                </Zoom>
              </Show>
            );
          }
          return (
            <div className="relative w-full h-[200px]">
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-t-md" />
            </div>
          );
        })()}
        {user?.auth?.username === data?.userId && !isLoading && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                className="absolute bg-background! right-2 px-[8px]! bottom-2 z-10"
                variant="outline"
                disabled={isUploading}
              >
                <CameraMinimalistic />
                <span className="md:text-sm text-xs">{t('layout:header.change_cover')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={-2}>
              <DropdownMenuArrow />
              <DropdownMenuItem
                onClick={() => {
                  useProfileModalStore.getState().setIsClickModalEdit(false);
                  openCoverHistoryDialog();
                }}
              >
                <Gallery />
                <span className="md:text-sm text-xs">{t('profile:choose_cover_image')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  useProfileModalStore.getState().setIsClickModalEdit(false);
                  triggerFileInput();
                }}
              >
                <GallerySend />
                <span className="md:text-sm text-xs">{t('profile:upload_new_cover')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="rounded-b-lg">
        <div className="md:px-4 px-4 md:pb-4 pb-4 custom-bg-1 w-full ">
          <Hero isLoading={isLoading} t={t} data={data} />
          {(() => {
            const canViewInfo =
              user?.auth?.username === data?.userId ||
              data?.privacy?.profileVisibility === PrivacyLevel.PRIVACY_LEVEL_PUBLIC;
            return (
              <Show when={canViewInfo || !!isLoading}>
                <Info isLoading={isLoading} t={t} data={data} />
              </Show>
            );
          })()}
        </div>
        <Tabs data={data} isLoading={isLoading} />
      </div>
      <Dialog
        open={isCoverHistoryDialogOpen}
        onClose={() => {
          closeCoverHistoryDialog();
          setSelectedCoverUrl(null);
        }}
        onAccept={handleChangeCoverFromHistory}
        title={t('profile:choose_image')}
        id="confirm-cover-upload"
        size="lg"
        disableAccept={!selectedCoverUrl || isUploading}
        isPending={isUploading}
      >
        <ChooseImage onSelect={setSelectedCoverUrl} selectedUrl={selectedCoverUrl} />
      </Dialog>
      {showConfirmChangeCoverUrl && (
        <Portal.Root>
          <div className="fixed top-0 right-0 bottom-0 left-0 z-120 bg-background h-(--header-height) flex items-center justify-between md:px-6 px-4">
            <h5 className="text-sm font-semibold">{t('profile:confirm_cover_upload')}</h5>
            <div className="flex justify-end items-center gap-2 h-full">
              <Button variant="outline" onClick={cancelUpload} disabled={isUploading}>
                {t('common:button.cancel')}
              </Button>
              <Button variant="default" onClick={confirmUpload} disabled={isUploading}>
                {t('common:button.confirm')}
              </Button>
            </div>
          </div>
        </Portal.Root>
      )}
    </div>
  );
};

export default ProfilePageContainer;
