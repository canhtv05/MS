import { withAuth } from '@/guard/withAuth';
import ProfilePageContainer from '@/views/pages/profile/ProfilePageContainer';

export interface IProfileParams {
  username: string;
}

const Profile = ({ params }: { params: Promise<IProfileParams> }) => {
  return <ProfilePageContainer params={params} />;
};

export default withAuth(Profile);
