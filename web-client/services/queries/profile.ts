'use client';

import {
  IDetailUserProfileDTO,
  IImageHistoryGroupDTO,
  IInterestDTO,
  IUserProfileDTO,
  IUserProfilePrivacyDTO,
} from '@/types/profile';
import { IResponseObject, ISearchResponse } from '@/types/common';
import { api } from '@/utils/api';
import cookieUtils from '@/utils/cookieUtils';
import { API_ENDPOINTS } from '@/configs/endpoints';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useProfileStore } from '@/stores/profile';
import {
  UserDetailDocument,
  UserDetailQuery,
  UserDetailQueryVariables,
  UserProfilePrivacyDocument,
  UserProfilePrivacyQuery,
  UserProfilePrivacyQueryVariables,
} from '../graphql/graphql';
import { getGraphQLClient } from '@/utils/graphql';
import { ResourceType } from '@/enums/common';
import { useAuthStore } from '@/stores/auth';
import { handleMutationError } from '@/utils/handler-mutation-error';

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
    staleTime: 5 * 60 * 1000, // 5 phút - profile ít thay đổi
    gcTime: 10 * 60 * 1000, // 10 phút - giữ cache lâu hơn
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
    staleTime: 2 * 60 * 1000, // 2 phút - media history có thể có media mới
    gcTime: 5 * 60 * 1000, // 5 phút - giữ cache
  });
};

export const useInterestInfiniteQuery = (searchText?: string, enabled: boolean = true) => {
  return useInfiniteQuery({
    queryKey: ['profile', 'interests'],
    queryFn: async ({
      pageParam = 1,
    }): Promise<IResponseObject<ISearchResponse<IInterestDTO[]>>> => {
      const res = await api.get(API_ENDPOINTS.PROFILE.INTERESTS, {
        params: {
          page: pageParam,
          size: 20,
          searchText: searchText,
        },
      });
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
    enabled: enabled,
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 phút - interests có thể có interests mới
    gcTime: 5 * 60 * 1000, // 5 phút - giữ cache lâu hơn
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
    throwOnError: error => {
      handleMutationError(error, 'user-profile-query');
      return true;
    },
    enabled: enabled && !!us,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 phút - user profile ít thay đổi
    gcTime: 10 * 60 * 1000, // 10 phút - giữ cache lâu hơn
  });
  return query;
};

export const usePrivacyQuery = () => {
  const { user } = useAuthStore();
  const { userProfile, setUserProfile } = useProfileStore();
  const username = user?.auth?.username || '';

  return useQuery({
    queryKey: ['profile', 'privacy', username],
    queryFn: async (): Promise<IUserProfilePrivacyDTO> => {
      const client = getGraphQLClient();
      const variables: UserProfilePrivacyQueryVariables = {
        username,
      };
      if (userProfile?.userId === username && userProfile?.privacy) {
        return userProfile.privacy;
      }
      const res = await client.request<UserProfilePrivacyQuery>(
        UserProfilePrivacyDocument,
        variables,
      );
      const privacy = res.userDetail?.privacy as unknown as IUserProfilePrivacyDTO;
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          privacy,
        });
      }
      return privacy;
    },
    throwOnError: error => {
      handleMutationError(error, 'profile-privacy-query');
      return true;
    },
    enabled: !!username,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 phút - privacy settings ít thay đổi
    gcTime: 10 * 60 * 1000, // 10 phút - giữ cache lâu hơn
  });
};
