'use client';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { IconButton } from '@/components/animate-ui/components/buttons/icon';
import { AddCircle, Pen } from '@solar-icons/react-perf/category/style/Bold';
import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';
import ModalEditImage from './ModalEditImage';
import { useAuthStore } from '@/stores/auth';
import { ALLOWED_IMAGE_TYPES } from '@/utils/common';
import { useProfileModalStore } from '../use-profile-modal';

interface IChangeAvatar {
  selectHistoryAvatarUrl?: string | null;
  avatarFilePreview?: string | null;
  onFilePreviewChange?: (url: string | null) => void;
  onHistorySelect?: (url: string | null) => void;
}

const ChangeAvatar = ({
  selectHistoryAvatarUrl,
  avatarFilePreview,
  onFilePreviewChange,
  onHistorySelect,
}: IChangeAvatar) => {
  const { t } = useTranslation('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();
  const [openModalEditImage, setOpenModalEditImage] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!ALLOWED_IMAGE_TYPES.includes(selectedFile.type)) {
        event.target.value = '';
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        event.target.value = '';
        return;
      }

      const previewUrl = URL.createObjectURL(selectedFile);
      onFilePreviewChange?.(previewUrl);
      onHistorySelect?.(null);
      setOpenModalEditImage(true);
    }
    event.target.value = '';
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="flex items-center justify-between gap-2 p-1 w-full">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
        />
        <div className="flex items-center gap-2 w-full">
          <Button
            className="w-full dark:bg-primary/40"
            variant={'default'}
            onClick={triggerFileInput}
          >
            <AddCircle />
            {t('upload_new_avatar')}
          </Button>
        </div>
        <IconButton
          variant={'outline'}
          disabled={!user?.profile?.avatarUrl}
          onClick={() => {
            if (!user?.profile?.avatarUrl) return;
            setOpenModalEditImage(true);
          }}
        >
          <Pen />
        </IconButton>
      </div>
      <ModalEditImage
        open={openModalEditImage || useProfileModalStore.getState().isChildDialogOpen}
        onClose={() => {
          setOpenModalEditImage(false);
          useProfileModalStore.getState().closeChildDialog();
          if (avatarFilePreview) {
            URL.revokeObjectURL(avatarFilePreview);
            onFilePreviewChange?.(null);
            // Clear history selection when closing after file upload
            onHistorySelect?.(null);
          }
        }}
        avatarPreview={avatarFilePreview || selectHistoryAvatarUrl}
      />
    </>
  );
};

export default ChangeAvatar;
