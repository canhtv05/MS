'use client';

import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';
import {
  IChangePasswordRequest,
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
} from '@/types/auth';
import { IResponseObject } from '@/types/common';
import { api } from '@/utils/api';
import cookieUtils from '@/utils/cookieUtils';
import { API_ENDPOINTS } from '@/utils/endpoints';
import { handleMutationError } from '@/utils/handler-mutation-error';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export const useAuthMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation('auth');
  const accessToken = cookieUtils.getStorage()?.accessToken;

  const setUser = useAuthStore(state => state.setUser);
  const setToken = useAuthStore(state => state.setToken);
  const setUserProfile = useProfileStore(state => state.setUserProfile);

  const loginMutation = useMutation({
    mutationKey: ['/auth/me/p/authenticate'],
    mutationFn: async (payload: ILoginRequest): Promise<IResponseObject<ILoginResponse>> =>
      await api.post(API_ENDPOINTS.AUTH.LOGIN, payload),
    onError: error => handleMutationError(error, 'login-toast'),
    onMutate: () => {
      toast.loading(t('sign_in.loading'), { id: 'login-toast' });
    },
    onSuccess: async res => {
      if (res.data) {
        const { token } = res.data;
        setToken(token);
        queryClient.removeQueries({ queryKey: ['auth', 'me'] });
        queryClient.removeQueries({ queryKey: ['profile', 'me'] });
        await queryClient.fetchQuery({
          queryKey: ['auth', 'me'],
          queryFn: async () => {
            const profileRes = await api.get(API_ENDPOINTS.AUTH.ME, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setUser(profileRes.data.data);
            return profileRes.data;
          },
        });

        await queryClient.fetchQuery({
          queryKey: ['profile', 'me'],
          queryFn: async () => {
            const profileRes = await api.get(API_ENDPOINTS.PROFILE.ME, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setUserProfile(profileRes.data.data);
            return profileRes.data;
          },
        });

        router.push('/home');
        toast.success(t('sign_in.login_success'), { id: 'login-toast' });
      }
    },
  });

  const logoutMutation = useMutation({
    mutationKey: ['/auth/me/p/logout'],
    mutationFn: async (): Promise<IResponseObject<void>> =>
      await api.post(API_ENDPOINTS.AUTH.LOGOUT, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    onError: error => handleMutationError(error, 'logout-toast'),
    onMutate: () => {
      toast.loading(t('logout.loading'), { id: 'logout-toast' });
    },
    onSuccess: () => {
      setUser(undefined);
      setUserProfile(undefined);
      queryClient.removeQueries({ queryKey: ['auth', 'me'] });
      queryClient.removeQueries({ queryKey: ['profile', 'me'] });
      cookieUtils.deleteStorage();
      toast.success(t('logout.logout_success'), { id: 'logout-toast' });
    },
  });

  const registerMutation = useMutation({
    mutationKey: ['/auth/me/c/create'],
    mutationFn: async (payload: IRegisterRequest): Promise<IResponseObject<void>> =>
      await api.post(API_ENDPOINTS.AUTH.REGISTER, payload),
    onError: error => handleMutationError(error, 'register-toast'),
    onMutate: () => {
      toast.loading(t('sign_up.loading'), { id: 'register-toast' });
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['auth', 'me'] });
      queryClient.removeQueries({ queryKey: ['profile', 'me'] });
      toast.success(t('sign_up.register_success'), { id: 'register-toast' });
      // router.push('/sign-in');
    },
  });

  const changePasswordMutation = useMutation({
    mutationKey: ['/auth/me/p/change-password'],
    mutationFn: async (payload: IChangePasswordRequest): Promise<IResponseObject<void>> =>
      await api.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    onError: error => handleMutationError(error, 'change-password-toast'),
    onMutate: () => {
      toast.loading(t('auth:change_password.loading'), { id: 'change-password-toast' });
    },
    onSuccess: async () => {
      setUser(undefined);
      setUserProfile(undefined);
      queryClient.removeQueries({ queryKey: ['auth', 'me'] });
      queryClient.removeQueries({ queryKey: ['profile', 'me'] });
      cookieUtils.deleteStorage();
      toast.success(t('auth:change_password.change_password_success'), {
        id: 'change-password-toast',
      });
    },
  });

  return {
    loginMutation,
    logoutMutation,
    registerMutation,
    changePasswordMutation,
  };
};
