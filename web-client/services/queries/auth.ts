'use client';

import { useAuthStore } from '@/stores/auth';
import { IUserProfileDTO } from '@/types/auth';
import cookieUtils from '@/utils/cookieUtils';
import { getGraphQLClient } from '@/utils/graphql';
import { useQuery } from '@tanstack/react-query';
import { MeDocument, MeQuery } from '../graphql/graphql';
import { AxiosError } from 'axios';
import { handleMutationError } from '@/utils/handler-mutation-error';

export const useAuthQuery = (enabled: boolean = true) => {
  const setUser = useAuthStore(state => state.setUser);
  const user = useAuthStore(state => state.user);
  const isAuthenticated = cookieUtils.getAuthenticated();

  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async (): Promise<IUserProfileDTO> => {
      try {
        const client = getGraphQLClient();
        const data = await client.request<MeQuery>(MeDocument);
        setUser(data.me as IUserProfileDTO);
        return data.me as IUserProfileDTO;
      } catch (error) {
        handleMutationError(error, 'auth-query');
        if (error instanceof AxiosError && error?.response?.status === 401) {
          cookieUtils.clearAuthenticated();
          setUser(undefined);
          return null as unknown as IUserProfileDTO;
        }
        throw error;
      }
    },
    enabled: enabled && isAuthenticated && !user,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 phút - auth info ít thay đổi
    gcTime: 10 * 60 * 1000, // 10 phút - giữ cache lâu hơn
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
