'use client';

import { use } from 'react';
import { IProfileParams } from '@/app/(home)/[username]/page';
import { useUserProfileQuery } from '@/services/queries/profile';

const useProfile = ({ params }: { params: Promise<IProfileParams> }) => {
  const { username } = use(params);
  const decodedUsername = decodeURIComponent(username);
  const { data } = useUserProfileQuery(decodedUsername);

  return { data };
};

export default useProfile;
