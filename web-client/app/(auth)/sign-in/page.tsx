import { withAuth } from '@/guard';
import SignInPage from '@/views/pages/sign-in/SignInPage';

const SignIn = () => {
  return <SignInPage />;
};

export default withAuth(SignIn, {
  accessLevel: 'public',
});
