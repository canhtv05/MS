'use client';

import { useMyMediaHistoryQuery, useUserProfileQuery } from '@/services/queries/profile';
import { useProfileMutation } from '@/services/mutations/profile';
import { useState, useRef, useEffect } from 'react';

const useProfile = ({ username }: { username: string }) => {
  const { data, isLoading, isError, error, refetch } = useUserProfileQuery(username);
  const { changeCoverImageMutation } = useProfileMutation();
  const { query } = useMyMediaHistoryQuery(true, {
    page: 1,
    size: 20,
  });
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
      if (!allowedTypes.includes(selectedFile.type)) {
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

      try {
        await changeCoverImageMutation.mutateAsync({ file: selectedFile });
        await new Promise(resolve => {
          refetch();
          query.refetch();
          resolve(true);
        });
        URL.revokeObjectURL(previewUrl);
        setCoverImagePreview(null);
      } catch {
        URL.revokeObjectURL(previewUrl);
        setCoverImagePreview(null);
      }
    }
    event.target.value = '';
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

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
    isUploading: changeCoverImageMutation.isPending,
  };
};

export default useProfile;
