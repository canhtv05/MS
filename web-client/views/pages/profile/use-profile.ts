'use client';

import { useUserProfileQuery } from '@/services/queries/profile';
import { useProfileMutation } from '@/services/mutations/profile';
import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { ALLOWED_IMAGE_TYPES } from '@/utils/common';
import { useProfileModalStore } from './use-profile-modal';

const useProfile = ({ username }: { username: string }) => {
  const { data, isLoading, isError, error } = useUserProfileQuery(username);
  const queryClient = useQueryClient();
  const { t } = useTranslation('profile');
  const { changeCoverImageMutation, changeCoverImageFromMediaHistoryMutation } =
    useProfileMutation();
  const { user } = useAuthStore();

  const {
    isCoverHistoryDialogOpen,
    openCoverHistoryDialog,
    closeCoverHistoryDialog,
    selectedCoverUrl,
    setSelectedCoverUrl,
    coverImagePreview,
    setCoverImagePreview,
    pendingFile,
    setPendingFile,
    showConfirmChangeCoverUrl,
    setShowConfirmChangeCoverUrl,
    fileInputRef,
  } = useProfileModalStore();

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
      setCoverImagePreview(previewUrl);
      setPendingFile(selectedFile);
      setShowConfirmChangeCoverUrl(true);
    }
    event.target.value = '';
  };

  const confirmUpload = useCallback(async () => {
    if (!pendingFile) return;

    try {
      await changeCoverImageMutation.mutateAsync({ file: pendingFile });
      queryClient.invalidateQueries({
        queryKey: ['profile', 'media-history-infinite', user?.auth?.username, 'cover'],
      });
    } catch {
    } finally {
      if (coverImagePreview) {
        URL.revokeObjectURL(coverImagePreview);
      }
      setCoverImagePreview(null);
      setPendingFile(null);
      setShowConfirmChangeCoverUrl(false);
      if (!useProfileModalStore.getState().isClickModalEdit) return;
      useProfileModalStore.getState().resetCoverUpload();
      useProfileModalStore.getState().openEditContainer();
      useProfileModalStore.getState().openChangeCover();
    }
  }, [
    pendingFile,
    changeCoverImageMutation,
    queryClient,
    user?.auth?.username,
    coverImagePreview,
    setCoverImagePreview,
    setPendingFile,
    setShowConfirmChangeCoverUrl,
  ]);

  const cancelUpload = useCallback(() => {
    if (coverImagePreview) {
      URL.revokeObjectURL(coverImagePreview);
    }
    setCoverImagePreview(null);
    setPendingFile(null);
    setShowConfirmChangeCoverUrl(false);
    if (!useProfileModalStore.getState().isClickModalEdit) return;
    useProfileModalStore.getState().resetCoverUpload();
    useProfileModalStore.getState().openEditContainer();
    useProfileModalStore.getState().openChangeCover();
  }, [coverImagePreview, setCoverImagePreview, setPendingFile, setShowConfirmChangeCoverUrl]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleChangeCoverFromHistory = useCallback(async () => {
    if (pendingFile) {
      await confirmUpload();
      closeCoverHistoryDialog();
      setSelectedCoverUrl(null);
      return;
    }

    if (!selectedCoverUrl) return;

    const currentCoverUrl = data?.coverUrl;
    if (selectedCoverUrl === currentCoverUrl) {
      toast.error(t('change_cover_image_same'), {
        id: 'change-cover-image-from-media-history-toast',
      });
      return;
    }

    try {
      await changeCoverImageFromMediaHistoryMutation.mutateAsync({ url: selectedCoverUrl });
      queryClient.invalidateQueries({
        queryKey: ['profile', 'media-history-infinite', user?.auth?.username, 'cover'],
      });
    } catch {
    } finally {
      closeCoverHistoryDialog();
      setSelectedCoverUrl(null);
    }
  }, [
    selectedCoverUrl,
    data?.coverUrl,
    user?.auth?.username,
    t,
    changeCoverImageFromMediaHistoryMutation,
    queryClient,
    pendingFile,
    confirmUpload,
    closeCoverHistoryDialog,
    setSelectedCoverUrl,
  ]);

  useEffect(() => {
    return () => {
      if (coverImagePreview) {
        URL.revokeObjectURL(coverImagePreview);
      }
    };
  }, [coverImagePreview]);

  return {
    data,
    isLoading,
    isError,
    error,
    coverImagePreview,
    handleFileChange,
    triggerFileInput,
    fileInputRef,
    isUploading:
      changeCoverImageMutation.isPending || changeCoverImageFromMediaHistoryMutation.isPending,
    showConfirmChangeCoverUrl,
    confirmUpload,
    setShowConfirmChangeCoverUrl,
    isCoverHistoryDialogOpen,
    openCoverHistoryDialog,
    closeCoverHistoryDialog,
    selectedCoverUrl,
    setSelectedCoverUrl,
    cancelUpload,
    handleChangeCoverFromHistory,
  };
};

export default useProfile;
