import { withAuth } from '@/guard';
import ForgotPasswordPage from '@/views/pages/forgot-password/ForgotPasswordPage';

const ForgotPassword = () => {
  return <ForgotPasswordPage />;
};

export default withAuth(ForgotPassword, {
  accessLevel: 'public',
});
