import { withAuth } from '@/guard/withAuth';
import HomePage from '@/views/pages/home/HomePage';

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-var(--header-height)-var(--sp-layout)*2)]">
      <HomePage />
    </div>
  );
};
export default withAuth(Home, {
  accessLevel: 'public',
});
