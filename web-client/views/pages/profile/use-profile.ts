'use client';

import { useUserProfileQuery } from '@/services/queries/profile';

const useProfile = ({ username }: { username: string }) => {
  const { data, isLoading, isError, error } = useUserProfileQuery(username);

  return { data, isLoading, isError, error };
};

export default useProfile;
