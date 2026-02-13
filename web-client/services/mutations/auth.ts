'use client';

import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';
import {
  IChangePasswordRequest,
  IForgotPasswordRequest,
  ILoginRequest,
  IAuthenticateResponse,
  IRegisterRequest,
  IResetPasswordReq,
  IVerifyOTPReq,
} from '@/types/auth';
import { IResponseObject } from '@/types/common';
import { api } from '@/utils/api';
import cookieUtils from '@/utils/cookieUtils';
import { API_ENDPOINTS } from '@/configs/endpoints';
import { handleMutationError } from '@/utils/handler-mutation-error';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { getGraphQLClient } from '@/utils/graphql';
import { MeDocument, MeQuery } from '../graphql/graphql';
import { IUserProfileDTO } from '@/types/auth';
import { logger } from '@/lib/logger';
import { CACHE_KEY } from '@/configs/cache-key';

export const useAuthMutation = (isLogoutAllDevices = false) => {
  const mutationKey = isLogoutAllDevices
    ? [CACHE_KEY.AUTH.MUTATION.LOGOUT_ALL_DEVICES]
    : [CACHE_KEY.AUTH.MUTATION.LOGOUT];
  const [showResendEmail, setShowResendEmail] = useState(false);
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation('auth');
  const returnUrl = searchParams.get('returnUrl');

  const { setUser, logout } = useAuthStore();
  const setUserProfile = useProfileStore(state => state.setUserProfile);

  const loginMutation = useMutation({
    mutationKey: [CACHE_KEY.AUTH.MUTATION.LOGIN],
    mutationFn: async (payload: ILoginRequest): Promise<IResponseObject<IAuthenticateResponse>> => {
      const res = await api.post(API_ENDPOINTS.AUTH.LOGIN, payload);
      return res.data;
    },
    onError: error => {
      if (error instanceof axios.AxiosError) {
        const message: string = error.response?.data?.message;
        if (message.includes('was not activated')) {
          setShowResendEmail(true);
        }
      }
      handleMutationError(error, 'login-toast');
    },
    onMutate: () => {
      toast.loading(t('sign_in.loading'), { id: 'login-toast' });
    },
    onSuccess: async res => {
      if (res.data) {
        const { authenticate } = res.data;
        cookieUtils.setAuthenticated(true);
        queryClient.removeQueries({ queryKey: CACHE_KEY.AUTH.QUERY.ME });

        if (!authenticate) {
          logger.error('User not authenticated');
          toast.error(t('sign_in.login_failed'), { id: 'login-toast' });
          return;
        }

        try {
          await queryClient.fetchQuery({
            queryKey: CACHE_KEY.AUTH.QUERY.ME,
            queryFn: async () => {
              const client = getGraphQLClient();
              const data = await client.request<MeQuery>(MeDocument);
              useAuthStore.getState().setUser(data.me as IUserProfileDTO);
              return data.me as IUserProfileDTO;
            },
          });
        } catch (err) {
          logger.error('Get user profile failed', err);
          toast.error(t('sign_in.login_failed'), { id: 'login-toast' });
          handleMutationError(err, 'login-toast');
          return;
        }

        if (returnUrl) {
          router.push(decodeURIComponent(returnUrl));
        } else if (!returnUrl && authenticate) {
          router.replace('/home');
        }
        toast.success(t('sign_in.login_success'), { id: 'login-toast' });
      }
    },
  });

  const logoutMutation = useMutation({
    mutationKey,
    mutationFn: async (): Promise<IResponseObject<void>> =>
      await api.post(
        isLogoutAllDevices ? API_ENDPOINTS.AUTH.LOGOUT_ALL_DEVICES : API_ENDPOINTS.AUTH.LOGOUT,
        null,
      ),
    onError: error => handleMutationError(error, 'logout-toast'),
    onMutate: () => {
      toast.loading(t('logout.loading'), { id: 'logout-toast' });
    },
    onSuccess: () => {
      setUser(undefined);
      setUserProfile(undefined);
      queryClient.removeQueries({ queryKey: CACHE_KEY.AUTH.QUERY.ME });
      queryClient.removeQueries({ queryKey: CACHE_KEY.PROFILE.QUERY.ME });
      cookieUtils.clearAuthenticated();
      logout();
      toast.success(t('logout.logout_success'), { id: 'logout-toast' });
    },
  });

  const registerMutation = useMutation({
    mutationKey: [CACHE_KEY.AUTH.MUTATION.REGISTER],
    mutationFn: async (payload: IRegisterRequest): Promise<IResponseObject<void>> =>
      await api.post(API_ENDPOINTS.AUTH.REGISTER, payload),
    onError: error => handleMutationError(error, 'register-toast'),
    onMutate: () => {
      toast.loading(t('sign_up.loading'), { id: 'register-toast' });
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: CACHE_KEY.AUTH.QUERY.ME });
      queryClient.removeQueries({ queryKey: CACHE_KEY.PROFILE.QUERY.ME });
      toast.success(t('sign_up.register_success'), { id: 'register-toast' });
      router.push('/sign-in');
    },
  });

  const changePasswordMutation = useMutation({
    mutationKey: [CACHE_KEY.AUTH.MUTATION.CHANGE_PASSWORD],
    mutationFn: async (payload: IChangePasswordRequest): Promise<IResponseObject<void>> =>
      await api.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, payload),
    onError: error => handleMutationError(error, 'change-password-toast'),
    onMutate: () => {
      toast.loading(t('auth:change_password.loading'), { id: 'change-password-toast' });
    },
    onSuccess: async () => {
      setUser(undefined);
      setUserProfile(undefined);
      queryClient.removeQueries({ queryKey: CACHE_KEY.AUTH.QUERY.ME });
      // queryClient.removeQueries({ queryKey: CACHE_KEY.PROFILE.QUERY.ME });
      cookieUtils.clearAuthenticated();
      logout();
      toast.success(t('auth:change_password.change_password_success'), {
        id: 'change-password-toast',
      });
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationKey: [CACHE_KEY.AUTH.MUTATION.FORGOT_PASSWORD],
    mutationFn: async (payload: IForgotPasswordRequest): Promise<IResponseObject<void>> =>
      await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, payload),
    onError: error => handleMutationError(error, 'forgot-password-toast'),
    onMutate: () => {
      toast.loading(t('auth:forgot_password.loading'), { id: 'forgot-password-toast' });
    },
    onSuccess: async () => {
      toast.success(t('auth:forgot_password.send_reset_password_email_success'), {
        id: 'forgot-password-toast',
      });
    },
  });

  const verifyForgotPasswordOTPMutation = useMutation({
    mutationKey: [CACHE_KEY.AUTH.MUTATION.VERIFY_FORGOT_PASSWORD_OTP],
    mutationFn: async (payload: IVerifyOTPReq): Promise<IResponseObject<void>> =>
      await api.post(API_ENDPOINTS.AUTH.VERIFY_FORGOT_PASSWORD_OTP, payload),
    onError: error => handleMutationError(error, 'verify-forgot-password-otp-toast'),
    onMutate: () => {
      toast.loading(t('auth:verify_forgot_password_otp.loading'), {
        id: 'verify-forgot-password-otp-toast',
      });
    },
    onSuccess: async () => {
      toast.success(t('auth:verify_forgot_password_otp.verify_otp_success'), {
        id: 'verify-forgot-password-otp-toast',
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationKey: [CACHE_KEY.AUTH.MUTATION.RESET_PASSWORD],
    mutationFn: async (payload: IResetPasswordReq): Promise<IResponseObject<void>> =>
      await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, payload),
    onError: error => handleMutationError(error, 'reset-password-toast'),
    onMutate: () => {
      toast.loading(t('auth:reset_password.loading'), { id: 'reset-password-toast' });
    },
    onSuccess: async () => {
      toast.success(t('auth:reset_password.reset_password_success'), {
        id: 'reset-password-toast',
      });
      router.push('/sign-in');
    },
  });

  return {
    loginMutation,
    logoutMutation,
    registerMutation,
    changePasswordMutation,
    forgotPasswordMutation,
    verifyForgotPasswordOTPMutation,
    showResendEmail,
    resetPasswordMutation,
    setShowResendEmail,
  };
};
