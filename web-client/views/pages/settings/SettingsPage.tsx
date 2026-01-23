'use client';

import Wrapper from '@/components/customs/wrapper';

const SettingsPage = () => {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-black text-gray-900 dark:text-white">Settings</h1>

      {/* Account Settings */}
      <Wrapper title="Account">
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
      </Wrapper>

      {/* Privacy Settings */}
      <Wrapper title="Privacy">
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
      </Wrapper>

      {/* Notification Settings */}
      <Wrapper title="Notifications">
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
      </Wrapper>

      {/* Danger Zone */}
      <Wrapper
        title="Danger Zone"
        className="border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20"
      >
        <div className="p-4 border border-red-200 dark:border-red-900 rounded-lg bg-red-50 dark:bg-red-950">
          <h3 className="font-medium text-red-900 dark:text-red-100">Delete Account</h3>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1 mb-3">
            Once you delete your account, there is no going back.
          </p>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors">
            Delete Account
          </button>
        </div>
      </Wrapper>
    </div>
  );
};

export default SettingsPage;
