'use client';

import { forgotPasswordSchema } from '@/validations/auth';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthMutation } from '@/services/mutations/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

const useForgotPassword = () => {
  const router = useRouter();
  const { forgotPasswordMutation } = useAuthMutation();
  const [isSent, setIsSent] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: z.infer<typeof forgotPasswordSchema>) => {
    forgotPasswordMutation.mutate(data, {
      onSuccess: () => {
        setIsSent(true);
      },
      onError: data => {
        if (data instanceof axios.AxiosError) {
          console.log(data.response?.data);
        }
      },
    });
  };

  const navigateSignIn = () => {
    router.push('/sign-in');
  };

  return {
    onSubmit,
    form,
    navigateSignIn,
  };
};

export default useForgotPassword;
