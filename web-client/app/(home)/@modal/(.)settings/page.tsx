import { withAuth } from '@/guard/withAuth';
import SettingsPage from '@/views/pages/settings/SettingsPage';
import SettingsLayout from '@/views/layouts/settings/SettingsLayout';

const SettingsModal = () => {
  return (
    <SettingsLayout>
      <SettingsPage />
    </SettingsLayout>
  );
};

export default withAuth(SettingsModal, {
  accessLevel: 'authenticated',
  redirectTo: '/home',
});
