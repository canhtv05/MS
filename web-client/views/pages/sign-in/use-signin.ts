'use client';

import { signInSchema } from '@/validations/auth';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthMutation } from '@/services/mutations/auth';
import { useNotificationMutation } from '@/services/mutations/notification';

const useSignIn = () => {
  const { loginMutation, showResendEmail, setShowResendEmail } = useAuthMutation();
  const { resendVerifyEmailMutation } = useNotificationMutation();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = (data: z.infer<typeof signInSchema>) => {
    loginMutation.mutate(data);
  };

  const handleResendVerifyEmail = () => {
    resendVerifyEmailMutation.mutate({
      to: '',
      username: form.getValues('username'),
    });
  };

  return {
    onSubmit,
    form,
    showResendEmail,
    setShowResendEmail,
    handleResendVerifyEmail,
  };
};

export default useSignIn;
