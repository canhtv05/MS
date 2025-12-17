import { withAuth } from '@/guard/withAuth';
import ProfilePage from '@/views/pages/profile/ProfilePage';

export interface IProfileParams {
  username: string;
}

const Profile = ({ params }: { params: Promise<IProfileParams> }) => {
  return <ProfilePage params={params} />;
};

export default withAuth(Profile);
