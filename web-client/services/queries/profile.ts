'use client';

import { IDetailUserProfileDTO, IMediaHistoryGroupDTO, IUserProfileDTO } from '@/types/profile';
import { IResponseObject, ISearchRequest, ISearchResponse } from '@/types/common';
import { api } from '@/utils/api';
import cookieUtils from '@/utils/cookieUtils';
import { API_ENDPOINTS } from '@/configs/endpoints';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useProfileStore } from '@/stores/profile';
import { GET_USER_DETAIL_QUERY } from '../graphql/query';
import { getGraphQLClient } from '@/utils/graphql';

interface GetUserDetailResponse {
  userDetail: IDetailUserProfileDTO;
}

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
    refetchOnMount: false,
  });

  return {
    meQuery,
    userProfile,
  };
};

export const useMyMediaHistoryInfiniteQuery = (
  enabled: boolean = true,
  userID?: string,
  searchRequest?: ISearchRequest,
) => {
  return useInfiniteQuery({
    queryKey: ['profile', 'media-history-infinite', userID, { ...searchRequest }],
    queryFn: async ({
      pageParam = 1,
    }): Promise<IResponseObject<ISearchResponse<IMediaHistoryGroupDTO[]>>> => {
      const res = await api.post(
        API_ENDPOINTS.PROFILE.MY_MEDIA_HISTORY,
        {},
        {
          params: {
            page: pageParam,
            size: 20,
            ...searchRequest,
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
  let us = username || '';
  if (us.startsWith('@')) {
    us = us.slice(1);
  }

  const query = useQuery({
    queryKey: ['profile', 'user-profile', us],
    queryFn: async (): Promise<IDetailUserProfileDTO> => {
      const client = getGraphQLClient();
      const res = await client.request<GetUserDetailResponse>(GET_USER_DETAIL_QUERY, {
        username: us,
      });
      return res.userDetail;
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
