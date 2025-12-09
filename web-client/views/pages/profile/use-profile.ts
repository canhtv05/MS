'use client';

import { useUserProfileQuery } from '@/services/queries/profile';

const useProfile = ({ username }: { username: string }) => {
  const { data } = useUserProfileQuery(username);

  return { data };
};

export default useProfile;
