import { withAuth } from '@/guard/withAuth';

const SettingsPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Cài đặt hệ thống</h1>
    </div>
  );
};

const ProtectedSettingsPage = withAuth(SettingsPage, {
  accessLevel: 'authenticated',
  redirectTo: '/home',
});

export default ProtectedSettingsPage;
