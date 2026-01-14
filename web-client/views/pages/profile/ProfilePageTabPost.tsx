'use client';

import { IDetailUserProfileDTO } from '@/types/profile';
import ProfilePageHeroTabPost from './ProfilePageHeroTabPost';

interface IProfilePageTabPost {
  data?: IDetailUserProfileDTO;
}

const ProfilePageTabPost = ({ data }: IProfilePageTabPost) => {
  return (
    <div>
      <ProfilePageHeroTabPost data={data} />
    </div>
  );
};

export default ProfilePageTabPost;
