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
import {
  IChangeCoverByUrlReq,
  IDetailUserProfileDTO,
  IUpdateBioAndFullnameProfileReq,
  IPrivacyDTO,
  IInterestDTO,
  ICreateInterestReq,
  IUserProfileUpdateInterestReq,
  IUpdateProfileIntroduceDTO,
} from '@/types/profile';
import { useMyProfileStore } from '@/stores/profile';
import { useAuthStore } from '@/stores/auth';
import { CACHE_KEY } from '@/configs/cache-key';

export const useProfileMutation = () => {
  const { t } = useTranslation('profile');
  const { setMyProfile: setUserProfile } = useMyProfileStore();
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  const changeCoverImageMutation = useMutation({
    mutationKey: [CACHE_KEY.PROFILE.MUTATION.CHANGE_COVER_IMAGE],
    mutationFn: async (payload: MultipartFile): Promise<IResponseObject<IProfileDTO>> => {
      const formData = new FormData();
      formData.append('file', payload.file);
      const response = await api.put(API_ENDPOINTS.PROFILE.CHANGE_COVER_IMAGE, formData, {
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
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: CACHE_KEY.PROFILE.QUERY.ME,
        }),
        queryClient.invalidateQueries({
          queryKey: CACHE_KEY.PROFILE.QUERY.USER_PROFILE(user?.auth?.username),
        }),
        queryClient.invalidateQueries({
          queryKey: CACHE_KEY.PROFILE.QUERY.MEDIA_HISTORY_INFINITE(user?.auth?.username),
        }),
      ]);
      toast.success(t('change_cover_image_success'), {
        id: 'change-cover-image-toast',
      });
    },
  });

  const changeAvatarImageMutation = useMutation({
    mutationKey: [CACHE_KEY.PROFILE.MUTATION.CHANGE_AVATAR_IMAGE],
    mutationFn: async (payload: MultipartFile): Promise<IResponseObject<IProfileDTO>> => {
      const formData = new FormData();
      formData.append('file', payload.file);
      const response = await api.put(API_ENDPOINTS.PROFILE.CHANGE_AVATAR_IMAGE, formData, {
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
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: CACHE_KEY.PROFILE.QUERY.ME,
        }),
        queryClient.invalidateQueries({
          queryKey: CACHE_KEY.PROFILE.QUERY.USER_PROFILE(user?.auth?.username),
        }),
        queryClient.invalidateQueries({
          queryKey: CACHE_KEY.PROFILE.QUERY.MEDIA_HISTORY_INFINITE(user?.auth?.username),
        }),
      ]);
      toast.success(t('change_avatar_image_success'), {
        id: 'change-avatar-image-toast',
      });
    },
  });

  const changeCoverImageFromMediaHistoryMutation = useMutation({
    mutationKey: [CACHE_KEY.PROFILE.MUTATION.CHANGE_COVER_IMAGE_FROM_MEDIA_HISTORY],
    mutationFn: async (payload: IChangeCoverByUrlReq): Promise<IResponseObject<IProfileDTO>> => {
      const response = await api.put(
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
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: CACHE_KEY.PROFILE.QUERY.ME,
        }),
        queryClient.invalidateQueries({
          queryKey: CACHE_KEY.PROFILE.QUERY.USER_PROFILE(user?.auth?.username),
        }),
        queryClient.invalidateQueries({
          queryKey: CACHE_KEY.PROFILE.QUERY.MEDIA_HISTORY_INFINITE(user?.auth?.username),
        }),
      ]);
      toast.success(t('change_cover_image_success'), {
        id: 'change-cover-image-from-media-history-toast',
      });
    },
  });

  const updateBioAndFullnameProfileMutation = useMutation({
    mutationKey: [CACHE_KEY.PROFILE.MUTATION.UPDATE_BIO_AND_FULLNAME_PROFILE],
    mutationFn: async (
      payload: IUpdateBioAndFullnameProfileReq,
    ): Promise<IResponseObject<IProfileDTO>> => {
      const response = await api.put(
        API_ENDPOINTS.PROFILE.UPDATE_BIO_AND_FULLNAME_PROFILE,
        payload,
      );
      return response.data;
    },
    onError: error => handleMutationError(error, 'update-bio-and-fullname-profile-toast'),
    onMutate: () => {
      toast.loading(t('update_bio_and_fullname_profile_loading'), {
        id: 'update-bio-and-fullname-profile-toast',
      });
    },
    onSuccess: async data => {
      setUserProfile(data?.data as IDetailUserProfileDTO);
      if (user && data?.data) {
        setUser({ ...user, profile: data.data });
      }
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: CACHE_KEY.PROFILE.QUERY.ME,
        }),
        queryClient.invalidateQueries({
          queryKey: CACHE_KEY.PROFILE.QUERY.USER_PROFILE(user?.auth?.username),
        }),
      ]);
      toast.success(t('update_bio_and_fullname_profile_success'), {
        id: 'update-bio-and-fullname-profile-toast',
      });
    },
  });

  const updatePrivacyMutation = useMutation({
    mutationKey: [CACHE_KEY.PROFILE.MUTATION.UPDATE_PRIVACY],
    mutationFn: async (payload: IPrivacyDTO): Promise<IResponseObject<IPrivacyDTO>> => {
      const response = await api.put(API_ENDPOINTS.PROFILE.UPDATE_PRIVACY, payload);
      return response.data;
    },
    onError: error => handleMutationError(error, 'update-privacy-toast'),
    onMutate: () => {
      toast.loading(t('update_privacy_loading'), {
        id: 'update-privacy-toast',
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: CACHE_KEY.PROFILE.QUERY.ME,
        }),
        queryClient.invalidateQueries({
          queryKey: CACHE_KEY.PROFILE.QUERY.PRIVACY(user?.auth?.username),
        }),
        queryClient.invalidateQueries({
          queryKey: CACHE_KEY.PROFILE.QUERY.USER_PROFILE(user?.auth?.username),
        }),
      ]);
      toast.success(t('update_privacy_success'), {
        id: 'update-privacy-toast',
      });
    },
  });

  const createInterestMutation = useMutation({
    mutationKey: [CACHE_KEY.PROFILE.MUTATION.INTERESTS],
    mutationFn: async (payload: ICreateInterestReq): Promise<IResponseObject<IInterestDTO>> => {
      const response = await api.post(API_ENDPOINTS.PROFILE.INTERESTS, payload);
      return response.data;
    },
    onError: error => handleMutationError(error, 'create-interest-toast'),
    onMutate: () => {
      toast.loading(t('profile:create_interest_loading'), {
        id: 'create-interest-toast',
      });
    },
    onSuccess: async data => {
      queryClient.invalidateQueries({
        queryKey: CACHE_KEY.PROFILE.QUERY.INTERESTS(),
      });
      toast.success(t('profile:create_interest_success'), {
        id: 'create-interest-toast',
      });
      return data?.data as IInterestDTO;
    },
  });

  const updateUserProfileInterestMutation = useMutation({
    mutationKey: [CACHE_KEY.PROFILE.MUTATION.UPDATE_USER_PROFILE_INTEREST],
    mutationFn: async (payload: IUserProfileUpdateInterestReq): Promise<IResponseObject<void>> => {
      const response = await api.put(API_ENDPOINTS.PROFILE.UPDATE_USER_PROFILE_INTEREST, payload);
      return response.data;
    },
    onError: error => handleMutationError(error, 'update-user-profile-interest-toast'),
    onMutate: () => {
      toast.loading(t('update_user_profile_interest_loading'), {
        id: 'update-user-profile-interest-toast',
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: CACHE_KEY.PROFILE.QUERY.INTERESTS(),
        }),
        queryClient.invalidateQueries({
          queryKey: CACHE_KEY.PROFILE.QUERY.USER_PROFILE(user?.auth?.username),
        }),
      ]);
      toast.success(t('update_user_profile_interest_success'), {
        id: 'update-user-profile-interest-toast',
      });
    },
  });

  const updateUserProfileIntroduceMutation = useMutation({
    mutationKey: [CACHE_KEY.PROFILE.MUTATION.UPDATE_USER_PROFILE_INTRODUCE],
    mutationFn: async (
      payload: Partial<IUpdateProfileIntroduceDTO>,
    ): Promise<IResponseObject<IUpdateProfileIntroduceDTO>> => {
      const response = await api.put(API_ENDPOINTS.PROFILE.UPDATE_USER_PROFILE_INTRODUCE, payload);
      return response.data;
    },
    onError: error => handleMutationError(error, 'update-user-profile-introduce-toast'),
    onMutate: () => {
      toast.loading(t('update_user_profile_introduce_loading'), {
        id: 'update-user-profile-introduce-toast',
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: CACHE_KEY.PROFILE.QUERY.USER_PROFILE(user?.auth?.username),
        }),
      ]);
      toast.success(t('update_user_profile_introduce_success'), {
        id: 'update-user-profile-introduce-toast',
      });
    },
  });

  return {
    changeCoverImageMutation,
    changeCoverImageFromMediaHistoryMutation,
    changeAvatarImageMutation,
    updateBioAndFullnameProfileMutation,
    updatePrivacyMutation,
    createInterestMutation,
    updateUserProfileInterestMutation,
    updateUserProfileIntroduceMutation,
  };
};
