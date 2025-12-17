'use client';

import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';

const useNavigationLayout = () => {
  const { userProfile } = useProfileStore();
  const { user } = useAuthStore();

  return {
    userProfile,
    user,
  };
};

export default useNavigationLayout;
