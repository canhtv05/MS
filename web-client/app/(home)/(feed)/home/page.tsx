import { withAuth } from '@/guard/withAuth';

const Home = () => {
  return <div className="min-h-[calc(100vh-var(--header-height)-var(--sp-layout))]">Home</div>;
};
export default withAuth(Home, {
  accessLevel: 'public',
});
