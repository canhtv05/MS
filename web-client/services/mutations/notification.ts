'use client';

import { IResponseObject } from '@/types/common';
import { IVerificationEmailEvent } from '@/types/notification';
import { api } from '@/utils/api';
import { API_ENDPOINTS } from '@/configs/endpoints';
import { handleMutationError } from '@/utils/handler-mutation-error';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export const useNotificationMutation = () => {
  const { t } = useTranslation('notification');

  const resendVerifyEmailMutation = useMutation({
    mutationKey: [API_ENDPOINTS.NOTIFICATIONS.RESEND_VERIFY_EMAIL],
    mutationFn: async (payload: IVerificationEmailEvent): Promise<IResponseObject<void>> =>
      await api.post(API_ENDPOINTS.NOTIFICATIONS.RESEND_VERIFY_EMAIL, payload),
    onError: error => handleMutationError(error, 'resend-verify-email-toast'),
    onMutate: () => {
      toast.loading(t('notification:resend_verify_email.loading'), {
        id: 'resend-verify-email-toast',
      });
    },
    onSuccess: async () => {
      toast.success(t('notification:resend_verify_email.resend_verify_email_success'), {
        id: 'resend-verify-email-toast',
      });
    },
  });

  return {
    resendVerifyEmailMutation,
  };
};
