import { withAuth } from '@/guard/withAuth';

const SettingsPage = () => {
  return (
    <div className="max-w-4xl h-[3000px] mx-auto p-6 bg-red-500">
      <h1 className="text-2xl font-bold mb-6">Hello world</h1>
    </div>
  );
};

export default withAuth(SettingsPage, {
  accessLevel: 'authenticated',
  redirectTo: '/home',
});
