'use client';

import { IMediaHistoryGroupDTO, IUserProfileDTO } from '@/types/profile';
import { IResponseObject, ISearchResponse } from '@/types/common';
import { api } from '@/utils/api';
import cookieUtils from '@/utils/cookieUtils';
import { API_ENDPOINTS } from '@/configs/endpoints';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useProfileStore } from '@/stores/profile';

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
  pageSize: number = 20,
  userID?: string,
) => {
  return useInfiniteQuery({
    queryKey: ['profile', 'media-history-infinite', userID],
    queryFn: async ({
      pageParam = 0,
    }): Promise<IResponseObject<ISearchResponse<IMediaHistoryGroupDTO[]>>> => {
      const res = await api.post(API_ENDPOINTS.PROFILE.MY_MEDIA_HISTORY, {
        page: pageParam,
        size: pageSize,
      });
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      const pagination = lastPage?.data?.pagination;
      if (pagination && pagination.currentPage < pagination.totalPages - 1) {
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

export const useUserProfileQuery = (username: string, enabled: boolean = true) => {
  let us = username;
  if (username.startsWith('@')) {
    us = username.slice(1);
  }

  const query = useQuery({
    queryKey: ['profile', 'user-profile', us],
    queryFn: async (): Promise<IResponseObject<IUserProfileDTO>> => {
      const res = await api.get(API_ENDPOINTS.PROFILE.GET_USER_PROFILE.replace('{username}', us));
      return res.data;
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
