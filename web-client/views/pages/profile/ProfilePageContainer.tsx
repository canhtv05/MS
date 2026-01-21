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
import Dialog from '@/components/customs/dialog';
import { Skeleton } from '@/components/customs/skeleton';
import ChooseImage from './modals/ChooseImage';
import { getImageSrcOrNull } from '@/lib/image-utils';
import { useProfileModalStore } from './use-profile-modal';
import { IProfileParams } from '@/app/(home)/(feed)/user/[username]/page';

export interface IProfilePageProps {
  isLoading: boolean;
  t?: TFunction<'translation', undefined>;
  data?: IDetailUserProfileDTO;
}

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

  if (!decodedUsername.startsWith('@')) {
    return (
      <div className="p-4">
        <h1 className="text-red-500 font-bold">{t('profile_not_found')}</h1>
        <p>
          {t('you_tried_to_access')} {decodedUsername}
        </p>
        <p>{t('expected_username_starting_with')}</p>
        <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded mt-2 text-xs">
          DEBUG INFO: params.username: {decodedUsername}
          decoded: {decodedUsername}
        </pre>
      </div>
    );
  }

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
            return (
              <Zoom
                zoomMargin={20}
                zoomImg={{
                  src: coverSrc,
                  alt: 'bg',
                }}
              >
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
                      <div className="text-white text-sm font-medium">
                        {t('layout:header.uploading')}...
                      </div>
                    </div>
                  )}
                </div>
              </Zoom>
            );
          }
          return (
            <div className="relative w-full h-[200px]">
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-t-md" />
            </div>
          );
        })()}
        {user?.auth?.username === data?.userId && !isLoading && (
          <DropdownMenu>
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
        <div className="md:px-4 px-4 md:pb-4 pb-4 custom-bg-1 w-full shadow-[0_0_10px_0_rgba(0,0,0,0.07)]">
          <Hero isLoading={isLoading} t={t} data={data} />
          <Info isLoading={isLoading} t={t} data={data} />
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
        <div className="fixed top-0 right-0 bottom-0 left-0 z-50 bg-background h-[60px] flex items-center justify-between md:px-6 px-4">
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
      )}
    </div>
  );
};

export default ProfilePageContainer;
