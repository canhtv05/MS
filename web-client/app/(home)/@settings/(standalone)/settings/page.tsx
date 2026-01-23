import { withAuth } from '@/guard/withAuth';

const SettingsPage = () => {
  return (
    <div className="mx-auto max-w-2xl p-6 custom-bg-1 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Settings</h1>

      {/* Account Settings */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Account</h2>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white">Email</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">user@example.com</p>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white">Password</h3>
            <button className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Change password
            </button>
          </div>
        </div>
      </section>

      {/* Privacy Settings */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Privacy</h2>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white">Profile Visibility</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Control who can see your profile
            </p>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white">Activity Status</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Show when you&apos;re active
            </p>
          </div>
        </div>
      </section>

      {/* Notification Settings */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Notifications
        </h2>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Receive email updates</p>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white">Push Notifications</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Receive push notifications
            </p>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">Danger Zone</h2>
        <div className="p-4 border border-red-200 dark:border-red-900 rounded-lg bg-red-50 dark:bg-red-950">
          <h3 className="font-medium text-red-900 dark:text-red-100">Delete Account</h3>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1 mb-3">
            Once you delete your account, there is no going back.
          </p>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors">
            Delete Account
          </button>
        </div>
      </section>
    </div>
  );
};

export default withAuth(SettingsPage, {
  accessLevel: 'authenticated',
  redirectTo: '/home',
});
