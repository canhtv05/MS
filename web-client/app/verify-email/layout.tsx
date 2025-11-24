import AuthLayout from '@/views/layouts/auth/AuthLayout';

interface IVerifyEmailLayout {
  children: React.ReactNode;
}

const VerifyEmailLayout = ({ children }: IVerifyEmailLayout) => {
  return (
    <div>
      {children}
      <AuthLayout />
    </div>
  );
};

export default VerifyEmailLayout;
