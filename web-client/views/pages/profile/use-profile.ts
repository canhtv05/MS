'use client';

import { useUserProfileQuery } from '@/services/queries/profile';

const useProfile = ({ username }: { username: string }) => {
  const { data, isLoading, isError } = useUserProfileQuery(username);

  return { data, isLoading, isError };
};

export default useProfile;
