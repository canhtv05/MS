'use client';

import { useAuthStore } from '@/stores/auth';
import { ILoginRequest, ILoginResponse } from '@/types/auth';
import { IResponseObject } from '@/types/common';
import { api } from '@/utils/api';
import { API_ENDPOINTS } from '@/utils/endpoints';
import { handleMutationError } from '@/utils/handler-mutation-error';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useAuthMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const setUser = useAuthStore(state => state.setUser);
  const setToken = useAuthStore(state => state.setToken);

  const loginMutation = useMutation({
    mutationKey: ['/auth/me/p/authenticate'],
    mutationFn: async (payload: ILoginRequest): Promise<IResponseObject<ILoginResponse>> =>
      await api.post(API_ENDPOINTS.AUTH.LOGIN, payload),
    onError: error => handleMutationError(error, 'login-toast'),
    onMutate: () => {
      toast.loading('login...', { id: 'login-toast' });
    },
    onSuccess: async res => {
      if (res.data) {
        const { token } = res.data;
        setToken(token);
        queryClient.invalidateQueries({ queryKey: ['/auth/me'] });
        await queryClient.fetchQuery({
          queryKey: ['/auth/me'],
          queryFn: async () => {
            const profileRes = await api.get(API_ENDPOINTS.AUTH.ME, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setUser(profileRes.data.data);
            return profileRes.data;
          },
        });

        toast.success('logined', { id: 'login-toast' });
        router.push('/home');
      }
    },
  });

  return {
    loginMutation,
  };
};
