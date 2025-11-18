'use client';

import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';

const useSignIn = () => {
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push('/home');
  };

  return {
    handleSubmit,
  };
};

export default useSignIn;
