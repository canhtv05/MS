'use client';

import { VerificationStatus } from '@/enums';
import { IResponseObject } from '@/types/common';
import { IVerifyEmailTokenResponse } from '@/types/notification';
import { api, apiHandler } from '@/utils/api';
import { API_ENDPOINTS } from '@/utils/endpoints';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type TVerificationStatus = 'pending' | 'success' | 'error';

const useVerifyEmail = () => {
  const { t } = useTranslation('notification');
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<TVerificationStatus>('pending');
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage(t('verify.token_invalid'));
        return;
      }

      const [error, data] = await apiHandler<IResponseObject<IVerifyEmailTokenResponse>>(
        api.get(API_ENDPOINTS.NOTIFICATIONS.VERIFY_EMAIL, {
          params: { token },
        }),
      );

      if (error) {
        setStatus('error');
        setMessage(t('verify.verify_error'));
        return;
      }

      if (data?.data?.valid === true) {
        setStatus('success');
        setMessage(t('verify.verify_success'));
      } else {
        setStatus('error');
        if (data?.data?.verificationStatus === VerificationStatus.INVALID) {
          setMessage(t('verify.verify_invalid'));
        } else if (data?.data?.verificationStatus === VerificationStatus.EXPIRED) {
          setMessage(t('verify.verify_expired'));
        } else {
          setMessage(t('verify.verify_failed'));
        }
      }
    };

    verifyEmail();
  }, [token, t]);

  const handleGoToLogin = () => {
    router.push('/sign-in');
  };

  const handleGoHome = () => {
    router.push('/home');
  };

  return {
    status,
    message,
    handleGoToLogin,
    handleGoHome,
  };
};

export default useVerifyEmail;
