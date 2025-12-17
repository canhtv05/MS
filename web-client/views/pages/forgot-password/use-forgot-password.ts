'use client';

import {
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyForgotPasswordOTPSchema,
} from '@/validations/auth';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthMutation } from '@/services/mutations/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ErrorMessage } from '@/enums/error-message';

type TForgotPassword = 'FORGOT' | 'VERIFY' | 'RESET';

const useForgotPassword = () => {
  const router = useRouter();
  const { forgotPasswordMutation, verifyForgotPasswordOTPMutation, resetPasswordMutation } =
    useAuthMutation();
  const [type, setType] = useState<TForgotPassword>('FORGOT');

  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmitForgotPassword = (data: z.infer<typeof forgotPasswordSchema>) => {
    forgotPasswordMutation.mutate(data, {
      onSuccess: () => {
        setType('VERIFY');
      },
      onError: data => {
        if (data instanceof axios.AxiosError) {
          if (data?.response?.data?.code === ErrorMessage.FORGET_PASSWORD_OTP_ALREADY_SENT) {
            setType('VERIFY');
          }
        }
      },
    });
  };

  const verifyForgotPasswordOtpForm = useForm<z.infer<typeof verifyForgotPasswordOTPSchema>>({
    resolver: zodResolver(verifyForgotPasswordOTPSchema),
    defaultValues: {
      OTP: '',
      email: '',
    },
  });

  const onSubmitVerifyForgotPassword = (data: z.infer<typeof verifyForgotPasswordOTPSchema>) => {
    verifyForgotPasswordOTPMutation.mutate(data, {
      onSuccess: () => {
        setType('RESET');
      },
      onError: data => {
        if (data instanceof axios.AxiosError) {
          if (data?.response?.data?.code === ErrorMessage.FORGET_PASSWORD_OTP_ALREADY_SENT) {
            setType('RESET');
          }
        } else {
          setType('FORGOT');
        }
      },
    });
  };

  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      OTP: '',
      email: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmitResetPassword = (data: z.infer<typeof resetPasswordSchema>) => {
    resetPasswordMutation.mutate(data, {
      onSuccess: () => {
        setType('RESET');
      },
      onError: data => {
        if (data instanceof axios.AxiosError) {
          setType('FORGOT');
        }
      },
    });
  };

  const navigateSignIn = () => {
    router.push('/sign-in');
  };

  useEffect(() => {
    if (type === 'VERIFY') {
      verifyForgotPasswordOtpForm.setValue('email', forgotPasswordForm.getValues('email'));
    }
  }, [forgotPasswordForm, type, verifyForgotPasswordOtpForm]);

  useEffect(() => {
    if (type === 'RESET') {
      resetPasswordForm.setValue('email', forgotPasswordForm.getValues('email'));
      resetPasswordForm.setValue('OTP', verifyForgotPasswordOtpForm.getValues('OTP'));
    }
  }, [forgotPasswordForm, type, resetPasswordForm, verifyForgotPasswordOtpForm]);

  return {
    onSubmitForgotPassword,
    forgotPasswordForm,
    navigateSignIn,
    type,
    onSubmitVerifyForgotPassword,
    verifyForgotPasswordOtpForm,
    onSubmitResetPassword,
    resetPasswordForm,
  };
};

export default useForgotPassword;
