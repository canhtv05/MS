'use client';

import { signInSchema } from '@/validators/auth';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthMutation } from '@/services/mutations/auth';

const useSignIn = () => {
  const { loginMutation } = useAuthMutation();

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

  return {
    onSubmit,
    form,
  };
};

export default useSignIn;
