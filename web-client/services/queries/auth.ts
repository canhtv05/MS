'use client';

import { useAuthStore } from '@/stores/auth';
import { IUserProfileDTO } from '@/types/auth';
import cookieUtils from '@/utils/cookieUtils';
import { getGraphQLClient } from '@/utils/graphql';
import { CACHE_KEY } from '@/configs/cache-key';
import { MeDocument, MeQuery } from '../graphql/graphql';
import { useAppQuery } from '@/hooks/use-app-query';

export const useAuthQuery = (enabled: boolean = true) => {
  const setUser = useAuthStore(state => state.setUser);
  const user = useAuthStore(state => state.user);
  const isAuthenticated = cookieUtils.getAuthenticated();

  const query = useAppQuery<IUserProfileDTO>('PROFILE', {
    queryKey: CACHE_KEY.AUTH.QUERY.ME,
    queryFn: async (): Promise<IUserProfileDTO> => {
      const client = getGraphQLClient();
      const data = await client.request<MeQuery>(MeDocument);
      setUser(data.me as IUserProfileDTO);
      return data.me as IUserProfileDTO;
    },
    enabled: enabled && isAuthenticated && !user,
    retry: 1,
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
