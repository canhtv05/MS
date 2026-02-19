'use client';

import { useAuthStore } from '@/stores/auth';
import { useMyProfileStore } from '@/stores/profile';

const useNavigationLayout = () => {
  const { myProfile: userProfile } = useMyProfileStore();
  const { user } = useAuthStore();

  return {
    userProfile,
    user,
  };
};

export default useNavigationLayout;
