import { withAuth } from '@/guard/withAuth';
import ProfilePage from '@/views/pages/profile/ProfilePage';

interface IParams {
  username: string;
}

const Profile = ({ params }: { params: Promise<IParams> }) => {
  return <ProfilePage params={params} />;
};

export default withAuth(Profile);
