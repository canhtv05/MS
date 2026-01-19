'use client';

import { IResponseObject } from '@/types/common';
import { api } from '@/utils/api';
import { API_ENDPOINTS } from '@/configs/endpoints';
import { handleMutationError } from '@/utils/handler-mutation-error';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { IProfileDTO } from '@/types/auth';
import { MultipartFile } from '@/types/common';
import { IChangeCoverByUrlReq, IDetailUserProfileDTO, IUpdateBioProfileReq } from '@/types/profile';
import { useProfileStore } from '@/stores/profile';
import { useAuthStore } from '@/stores/auth';

export const useProfileMutation = () => {
  const { t } = useTranslation('profile');
  const { setUserProfile } = useProfileStore();
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  const changeCoverImageMutation = useMutation({
    mutationKey: [API_ENDPOINTS.PROFILE.CHANGE_COVER_IMAGE],
    mutationFn: async (payload: MultipartFile): Promise<IResponseObject<IProfileDTO>> => {
      const formData = new FormData();
      formData.append('file', payload.file);
      const response = await api.post(API_ENDPOINTS.PROFILE.CHANGE_COVER_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onError: error => handleMutationError(error, 'change-cover-image-toast'),
    onMutate: () => {
      toast.loading(t('change_cover_image_loading'), {
        id: 'change-cover-image-toast',
      });
    },
    onSuccess: async data => {
      setUserProfile(data?.data as IDetailUserProfileDTO);
      if (user && data?.data) {
        setUser({ ...user, profile: data.data });
      }
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['profile', 'me'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['profile', 'user-profile'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['profile', 'media-history-infinite', user?.auth?.username],
        }),
      ]);
      toast.success(t('change_cover_image_success'), {
        id: 'change-cover-image-toast',
      });
    },
  });

  const changeAvatarImageMutation = useMutation({
    mutationKey: [API_ENDPOINTS.PROFILE.CHANGE_AVATAR_IMAGE],
    mutationFn: async (payload: MultipartFile): Promise<IResponseObject<IProfileDTO>> => {
      const formData = new FormData();
      formData.append('file', payload.file);
      const response = await api.post(API_ENDPOINTS.PROFILE.CHANGE_AVATAR_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onError: error => handleMutationError(error, 'change-avatar-image-toast'),
    onMutate: () => {
      toast.loading(t('change_avatar_image_loading'), {
        id: 'change-avatar-image-toast',
      });
    },
    onSuccess: async data => {
      setUserProfile(data?.data as IDetailUserProfileDTO);
      if (user && data?.data) {
        setUser({ ...user, profile: data.data });
      }
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['profile', 'me'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['profile', 'user-profile'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['profile', 'media-history-infinite', user?.auth?.username],
        }),
      ]);
      toast.success(t('change_avatar_image_success'), {
        id: 'change-avatar-image-toast',
      });
    },
  });

  const changeCoverImageFromMediaHistoryMutation = useMutation({
    mutationKey: [API_ENDPOINTS.PROFILE.CHANGE_COVER_IMAGE_FROM_MEDIA_HISTORY],
    mutationFn: async (payload: IChangeCoverByUrlReq): Promise<IResponseObject<IProfileDTO>> => {
      const response = await api.post(
        API_ENDPOINTS.PROFILE.CHANGE_COVER_IMAGE_FROM_MEDIA_HISTORY,
        payload,
      );
      return response.data;
    },
    onError: error => handleMutationError(error, 'change-cover-image-from-media-history-toast'),
    onMutate: () => {
      toast.loading(t('change_cover_image_loading'), {
        id: 'change-cover-image-from-media-history-toast',
      });
    },
    onSuccess: async data => {
      setUserProfile(data?.data as IDetailUserProfileDTO);
      if (user && data?.data) {
        setUser({ ...user, profile: data.data });
      }
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['profile', 'me'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['profile', 'user-profile'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['profile', 'media-history-infinite', user?.auth?.username],
        }),
      ]);
      toast.success(t('change_cover_image_success'), {
        id: 'change-cover-image-from-media-history-toast',
      });
    },
  });

  const updateBioProfileMutation = useMutation({
    mutationKey: [API_ENDPOINTS.PROFILE.UPDATE_BIO],
    mutationFn: async (payload: IUpdateBioProfileReq): Promise<IResponseObject<IProfileDTO>> => {
      const response = await api.post(API_ENDPOINTS.PROFILE.UPDATE_BIO, payload);
      return response.data;
    },
    onError: error => handleMutationError(error, 'update-bio-profile-toast'),
    onMutate: () => {
      toast.loading(t('update_bio_profile_loading'), {
        id: 'update-bio-profile-toast',
      });
    },
    onSuccess: async data => {
      setUserProfile(data?.data as IDetailUserProfileDTO);
      if (user && data?.data) {
        setUser({ ...user, profile: data.data });
      }
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['profile', 'me'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['profile', 'user-profile'],
        }),
      ]);
      toast.success(t('update_bio_profile_success'), {
        id: 'update-bio-profile-toast',
      });
    },
  });
  return {
    changeCoverImageMutation,
    changeCoverImageFromMediaHistoryMutation,
    changeAvatarImageMutation,
    updateBioProfileMutation,
  };
};
