'use client';

import { IDetailUserProfileDTO, IImageHistoryGroupDTO, IUserProfileDTO } from '@/types/profile';
import { IResponseObject, ISearchResponse } from '@/types/common';
import { api } from '@/utils/api';
import cookieUtils from '@/utils/cookieUtils';
import { API_ENDPOINTS } from '@/configs/endpoints';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useProfileStore } from '@/stores/profile';
import { UserDetailDocument, UserDetailQuery, UserDetailQueryVariables } from '../graphql/graphql';
import { getGraphQLClient } from '@/utils/graphql';
import { ResourceType } from '@/enums/common';
import { useAuthStore } from '@/stores/auth';

export const useMyProfileQuery = (enabled: boolean = true) => {
  const userProfile = useProfileStore(state => state.userProfile);
  const setUserProfile = useProfileStore(state => state.setUserProfile);
  const isAuthenticated = cookieUtils.getAuthenticated();

  const meQuery = useQuery({
    queryKey: ['profile', 'me'],
    queryFn: async (): Promise<IResponseObject<IUserProfileDTO>> => {
      const res = await api.get(API_ENDPOINTS.PROFILE.ME);
      setUserProfile(res.data.data);
      return res.data;
    },
    enabled: enabled && isAuthenticated && !userProfile,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  return {
    meQuery,
    userProfile,
  };
};

export const useMyMediaHistoryInfiniteQuery = (
  enabled: boolean = true,
  userID?: string,
  resourceType?: ResourceType[],
) => {
  return useInfiniteQuery({
    queryKey: ['profile', 'media-history-infinite', userID, resourceType],
    queryFn: async ({
      pageParam = 1,
    }): Promise<IResponseObject<ISearchResponse<IImageHistoryGroupDTO[]>>> => {
      const res = await api.post(
        API_ENDPOINTS.FILES.SEARCH_MEDIA_HISTORY,
        {},
        {
          params: {
            page: pageParam,
            size: 20,
            searchText: userID,
            resourceType: resourceType,
          },
        },
      );
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const pagination = lastPage?.data?.pagination;
      if (pagination && pagination.currentPage < pagination.totalPages) {
        return pagination.currentPage + 1;
      }
      return undefined;
    },
    enabled: enabled && !!userID,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useUserProfileQuery = (username?: string, enabled: boolean = true) => {
  const { user } = useAuthStore();
  const { setUserProfile } = useProfileStore();
  let us = username || '';
  if (us.startsWith('@')) {
    us = us.slice(1);
  }

  const query = useQuery({
    queryKey: ['profile', 'user-profile', us],
    queryFn: async (): Promise<IDetailUserProfileDTO> => {
      const client = getGraphQLClient();
      const variables: UserDetailQueryVariables = {
        username: us,
        size: 9,
      };
      const res = await client.request<UserDetailQuery>(UserDetailDocument, variables);
      if (us === user?.auth?.username && res.userDetail) {
        setUserProfile(res.userDetail as unknown as IDetailUserProfileDTO);
      }
      return res.userDetail as unknown as IDetailUserProfileDTO;
    },
    enabled: enabled && !!us,
    retry: 1,
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    gcTime: 10 * 60 * 1000, // Garbage collection sau 10 phút
    refetchOnWindowFocus: false, // Không fetch lại khi focus window
    refetchOnMount: false, // Không fetch lại khi mount nếu đã có cache
  });
  return query;
};
