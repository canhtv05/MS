'use client';

import { useAuthStore } from '@/stores/auth';
import { IUserProfileDTO } from '@/types/auth';
import { IResponseObject } from '@/types/common';
import { api } from '@/utils/api';
import cookieUtils from '@/utils/cookieUtils';
import { API_ENDPOINTS } from '@/configs/endpoints';
import { useQuery } from '@tanstack/react-query';

export const useAuthQuery = (enabled: boolean = true) => {
  const setUser = useAuthStore(state => state.setUser);
  const user = useAuthStore(state => state.user);
  const token = cookieUtils.getStorage()?.accessToken;

  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async (): Promise<IResponseObject<IUserProfileDTO>> => {
      const res = await api.get(API_ENDPOINTS.AUTH.ME);
      setUser(res.data.data);
      return res.data;
    },
    enabled: enabled && !!token && !user, // Chỉ fetch khi có token
    retry: 1,
    refetchOnWindowFocus: false, // Không fetch lại khi focus window
    refetchOnMount: false, // Không fetch lại khi mount nếu đã có cache
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};
