import { withAuth } from '@/guard/withAuth';

const Home = () => {
  return <div className="min-h-screen">Home</div>;
};
export default withAuth(Home, {
  accessLevel: 'public',
});
