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
    enabled: enabled && !!token && !user,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    networkMode: 'offlineFirst',
  });

  if (user) {
    return {
      user,
      isLoading: false,
      isError: false,
      error: null,
    };
  }

  if (!token) {
    return {
      user: undefined,
      isLoading: false,
      isError: false,
      error: null,
    };
  }

  return {
    user: query.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};
