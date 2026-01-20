import { withAuth } from '@/guard/withAuth';

const Home = () => {
  return <div></div>;
};
export default withAuth(Home, {
  accessLevel: 'public',
});
