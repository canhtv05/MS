'use client';

import { IUserProfileDTO } from '@/types/profile';
import { IResponseObject } from '@/types/common';
import { api } from '@/utils/api';
import cookieUtils from '@/utils/cookieUtils';
import { API_ENDPOINTS } from '@/utils/endpoints';
import { useQuery } from '@tanstack/react-query';
import { useProfileStore } from '@/stores/profile';

export const useMyProfileQuery = (enabled: boolean = true) => {
  const userProfile = useProfileStore(state => state.userProfile);
  const setUserProfile = useProfileStore(state => state.setUserProfile);
  const token = cookieUtils.getStorage()?.accessToken;

  const meQuery = useQuery({
    queryKey: ['profile', 'me'],
    queryFn: async (): Promise<IResponseObject<IUserProfileDTO>> => {
      const res = await api.get(API_ENDPOINTS.PROFILE.ME, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserProfile(res.data.data);
      return res.data;
    },
    enabled: enabled && !!token && !userProfile, // Chỉ fetch khi có token
    retry: 1,
    // staleTime: 5 * 60 * 1000, // Cache 5 phút
    // gcTime: 10 * 60 * 1000, // Garbage collection sau 10 phút
    refetchOnWindowFocus: false, // Không fetch lại khi focus window
    refetchOnMount: false, // Không fetch lại khi mount nếu đã có cache
  });

  return {
    meQuery,
    userProfile,
  };
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
    enabled: enabled,
    retry: 1,
    // staleTime: 5 * 60 * 1000, // Cache 5 phút
    // gcTime: 10 * 60 * 1000, // Garbage collection sau 10 phút
    refetchOnWindowFocus: false, // Không fetch lại khi focus window
    refetchOnMount: false, // Không fetch lại khi mount nếu đã có cache
  });
  return query;
};
