'use client';

import { useAuthStore } from '@/stores/auth';
import { IUserProfileDTO } from '@/types/auth';
import cookieUtils from '@/utils/cookieUtils';
import { getGraphQLClient } from '@/utils/graphql';
import { useQuery } from '@tanstack/react-query';
import { ME_QUERY } from '../graphql/query';
import { AxiosError } from 'axios';

interface MeQueryResponse {
  me: IUserProfileDTO;
}

export const useAuthQuery = (enabled: boolean = true) => {
  const setUser = useAuthStore(state => state.setUser);
  const user = useAuthStore(state => state.user);
  const isAuthenticated = cookieUtils.getAuthenticated();

  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async (): Promise<IUserProfileDTO> => {
      try {
        const client = getGraphQLClient();
        const data = await client.request<MeQueryResponse>(ME_QUERY);
        setUser(data.me);
        return data.me;
      } catch (error) {
        if (error instanceof AxiosError && error?.response?.status === 401) {
          return null as unknown as IUserProfileDTO;
        }
        throw error;
      }
    },
    enabled: enabled && isAuthenticated && !user,
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

  if (!isAuthenticated) {
    return {
      user: undefined,
      isLoading: false,
      isError: false,
      error: null,
    };
  }

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};
