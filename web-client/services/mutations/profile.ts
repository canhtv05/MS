'use client';

import { IResponseObject } from '@/types/common';
import { api } from '@/utils/api';
import { API_ENDPOINTS } from '@/configs/endpoints';
import { handleMutationError } from '@/utils/handler-mutation-error';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { IProfileDTO } from '@/types/auth';
import { MultipartFile } from '@/types/common';

export const useProfileMutation = () => {
  const { t } = useTranslation('profile');

  const changeCoverImageMutation = useMutation({
    mutationKey: [API_ENDPOINTS.PROFILE.CHANGE_COVER_IMAGE],
    mutationFn: async (payload: MultipartFile): Promise<IResponseObject<IProfileDTO>> => {
      const formData = new FormData();
      formData.append('file', payload.file);
      return await api.post(API_ENDPOINTS.PROFILE.CHANGE_COVER_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onError: error => handleMutationError(error, 'change-cover-image-toast'),
    onMutate: () => {
      toast.loading(t('change_cover_image_loading'), {
        id: 'change-cover-image-toast',
      });
    },
    onSuccess: async () => {
      toast.success(t('change_cover_image_success'), {
        id: 'change-cover-image-toast',
      });
    },
  });

  return {
    changeCoverImageMutation,
  };
};
