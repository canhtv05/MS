'use client';

import { useUserProfileQuery } from '@/services/queries/profile';
import { useProfileMutation } from '@/services/mutations/profile';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { ALLOWED_IMAGE_TYPES } from '@/utils/common';

const useProfile = ({ username }: { username: string }) => {
  const { data, isLoading, isError, error } = useUserProfileQuery(username);
  const queryClient = useQueryClient();
  const { t } = useTranslation('profile');
  const { changeCoverImageMutation, changeCoverImageFromMediaHistoryMutation } =
    useProfileMutation();
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showConfirmChangeCoverUrl, setShowConfirmChangeCoverUrl] = useState(false);
  const [showDialogMediaHistory, setShowDialogMediaHistory] = useState(false);
  const [selectedCoverFromHistory, setSelectedCoverFromHistory] = useState<string | null>(null);
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    }
  }, [pendingFile, changeCoverImageMutation, queryClient, user?.auth?.username, coverImagePreview]);

  const cancelUpload = useCallback(() => {
    if (coverImagePreview) {
      URL.revokeObjectURL(coverImagePreview);
    }
    setCoverImagePreview(null);
    setPendingFile(null);
    setShowConfirmChangeCoverUrl(false);
  }, [coverImagePreview]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleChangeCoverFromHistory = useCallback(async () => {
    if (!selectedCoverFromHistory) return;

    const currentCoverUrl = data?.data?.coverUrl;
    if (selectedCoverFromHistory === currentCoverUrl) {
      toast.error(t('change_cover_image_same'), {
        id: 'change-cover-image-from-media-history-toast',
      });
      return;
    }

    try {
      await changeCoverImageFromMediaHistoryMutation.mutateAsync({ url: selectedCoverFromHistory });
      queryClient.invalidateQueries({
        queryKey: ['profile', 'media-history-infinite', user?.auth?.username, 'cover'],
      });
    } catch {
    } finally {
      setShowDialogMediaHistory(false);
      setSelectedCoverFromHistory(null);
    }
  }, [
    selectedCoverFromHistory,
    data?.data?.coverUrl,
    user?.auth?.username,
    t,
    changeCoverImageFromMediaHistoryMutation,
    queryClient,
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
    showDialogMediaHistory,
    setShowDialogMediaHistory,
    selectedCoverFromHistory,
    setSelectedCoverFromHistory,
    cancelUpload,
    handleChangeCoverFromHistory,
  };
};

export default useProfile;
