'use client';

import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';

const useNavigationLayout = () => {
  const { userProfile } = useProfileStore();
  const { user } = useAuthStore();

  console.log(userProfile, user);

  return {
    userProfile,
    user,
  };
};

export default useNavigationLayout;
