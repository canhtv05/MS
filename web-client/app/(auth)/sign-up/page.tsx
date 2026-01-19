import { withAuth } from '@/guard';
import SignUpPage from '@/views/pages/sign-up/SignUpPage';

const SingUpPage = () => {
  return <SignUpPage />;
};

export default withAuth(SingUpPage, {
  accessLevel: 'public',
});
