import { withAuth } from '@/guard/withAuth';
import SettingsPage from '@/views/pages/settings/SettingsPage';

const Settings = () => {
  return <SettingsPage />;
};

export default withAuth(Settings, {
  accessLevel: 'authenticated',
  redirectTo: '/home',
});
