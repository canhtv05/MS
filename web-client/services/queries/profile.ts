'use client';

import {
  IDetailUserProfileDTO,
  IImageHistoryGroupDTO,
  IInterestDTO,
  IUserProfileDTO,
  IUserProfilePrivacyDTO,
} from '@/types/profile';
import { IResponseObject, ISearchRequest, ISearchResponse } from '@/types/common';
import { api } from '@/utils/api';
import cookieUtils from '@/utils/cookieUtils';
import { API_ENDPOINTS } from '@/configs/endpoints';
import { useInfiniteQuery } from '@tanstack/react-query';
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
import { CACHE_KEY } from '@/configs/cache-key';
import { useAppQuery } from '@/hooks/use-app-query';

export const useMyProfileQuery = (enabled: boolean = true) => {
  const userProfile = useProfileStore(state => state.userProfile);
  const setUserProfile = useProfileStore(state => state.setUserProfile);
  const isAuthenticated = cookieUtils.getAuthenticated();

  const meQuery = useAppQuery<IResponseObject<IUserProfileDTO>>('PROFILE', {
    queryKey: CACHE_KEY.PROFILE.QUERY.ME,
    queryFn: async (): Promise<IResponseObject<IUserProfileDTO>> => {
      const res = await api.get(API_ENDPOINTS.PROFILE.ME);
      setUserProfile(res.data.data);
      return res.data;
    },
    enabled: enabled && isAuthenticated && !userProfile,
    retry: 1,
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
    queryKey: CACHE_KEY.PROFILE.QUERY.MEDIA_HISTORY_INFINITE(userID, resourceType),
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

export const useInterestInfiniteQuery = (
  searchRequest: ISearchRequest,
  enabled: boolean = true,
) => {
  return useInfiniteQuery({
    queryKey: CACHE_KEY.PROFILE.QUERY.INTERESTS(searchRequest as Record<string, unknown>),
    queryFn: async ({
      pageParam = 1,
    }): Promise<IResponseObject<ISearchResponse<IInterestDTO[]>>> => {
      const res = await api.get(API_ENDPOINTS.PROFILE.INTERESTS, {
        params: {
          page: pageParam,
          size: searchRequest.size || 50,
          searchText: searchRequest.searchText || '',
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

  const query = useAppQuery<IDetailUserProfileDTO, unknown>('PROFILE', {
    queryKey: CACHE_KEY.PROFILE.QUERY.USER_PROFILE(us),
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
  });
  return query;
};

export const usePrivacyQuery = () => {
  const { user } = useAuthStore();
  const { userProfile, setUserProfile } = useProfileStore();
  const username = user?.auth?.username || '';

  return useAppQuery<IUserProfilePrivacyDTO, unknown>('PROFILE', {
    queryKey: CACHE_KEY.PROFILE.QUERY.PRIVACY(username),
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
  });
};
