'use client';

import { signUpSchema } from '@/validations/auth';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthMutation } from '@/services/mutations/auth';

const useSignUp = () => {
  const { registerMutation } = useAuthMutation();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      fullname: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: z.infer<typeof signUpSchema>) => {
    registerMutation.mutate(data);
  };

  return {
    onSubmit,
    form,
  };
};

export default useSignUp;
