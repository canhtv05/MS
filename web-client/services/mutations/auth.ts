'use client';

import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';
import {
  IChangePasswordRequest,
  IForgotPasswordRequest,
  ILoginRequest,
  ILoginResponse,
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

export const useAuthMutation = () => {
  const [showResendEmail, setShowResendEmail] = useState(false);
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation('auth');
  const accessToken = cookieUtils.getStorage()?.accessToken;
  const returnUrl = searchParams.get('returnUrl');

  const setUser = useAuthStore(state => state.setUser);
  const setToken = useAuthStore(state => state.setToken);
  const setUserProfile = useProfileStore(state => state.setUserProfile);

  const loginMutation = useMutation({
    mutationKey: [API_ENDPOINTS.AUTH.LOGIN],
    mutationFn: async (payload: ILoginRequest): Promise<IResponseObject<ILoginResponse>> =>
      await api.post(API_ENDPOINTS.AUTH.LOGIN, payload),
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
        const { token } = res.data;
        setToken(token);
        await Promise.all([
          queryClient.removeQueries({ queryKey: ['auth', 'me'] }),
          // queryClient.removeQueries({ queryKey: ['profile', 'me'] }),
        ]);

        // await Promise.all([
        //   queryClient.fetchQuery({
        //     queryKey: ['auth', 'me'],
        //     queryFn: async () => {
        //       const profileRes = await api.get(API_ENDPOINTS.AUTH.ME, {
        //         headers: {
        //           Authorization: `Bearer ${token}`,
        //         },
        //       });
        //       setUser(profileRes.data.data);
        //       return profileRes.data;
        //     },
        //   }),

        //   queryClient.fetchQuery({
        //     queryKey: ['profile', 'me'],
        //     queryFn: async () => {
        //       const profileRes = await api.get(API_ENDPOINTS.PROFILE.ME, {
        //         headers: {
        //           Authorization: `Bearer ${token}`,
        //         },
        //       });
        //       setUserProfile(profileRes.data.data);
        //       return profileRes.data;
        //     },
        //   }),
        // ]);

        if (returnUrl) {
          router.push(decodeURIComponent(returnUrl));
        } else {
          router.push('/home');
        }
        toast.success(t('sign_in.login_success'), { id: 'login-toast' });
      }
    },
  });

  const logoutMutation = useMutation({
    mutationKey: [API_ENDPOINTS.AUTH.LOGOUT],
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
    mutationKey: [API_ENDPOINTS.AUTH.REGISTER],
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
      router.push('/sign-in');
    },
  });

  const changePasswordMutation = useMutation({
    mutationKey: [API_ENDPOINTS.AUTH.CHANGE_PASSWORD],
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
      // queryClient.removeQueries({ queryKey: ['profile', 'me'] });
      cookieUtils.deleteStorage();
      toast.success(t('auth:change_password.change_password_success'), {
        id: 'change-password-toast',
      });
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationKey: [API_ENDPOINTS.AUTH.FORGOT_PASSWORD],
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
    mutationKey: [API_ENDPOINTS.AUTH.VERIFY_FORGOT_PASSWORD_OTP],
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
    mutationKey: [API_ENDPOINTS.AUTH.RESET_PASSWORD],
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
