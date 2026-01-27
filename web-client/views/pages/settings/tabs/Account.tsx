'use client';

import { Radio, RadioGroup } from '@/components/animate-ui/components/base/radio';
import { Button } from '@/components/animate-ui/components/buttons/button';
import Dialog from '@/components/customs/dialog';
import { useHeaderState } from '@/views/layouts/home/use-header-state';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Label } from '@/components/customs/label';
import { useAuthMutation } from '@/services/mutations/auth';
import cookieUtils from '@/utils/cookieUtils';

const Account = () => {
  const { t } = useTranslation('settings');
  const { openChangePasswordDialog } = useHeaderState();
  const { logoutMutation: logoutCurrentDeviceMutation } = useAuthMutation();
  const { logoutMutation: logoutAllDevicesMutation } = useAuthMutation(true);
  const [openDialogLogout, setOpenDialogLogout] = useState(false);
  const [logoutType, setLogoutType] = useState<'current' | 'all'>('current');

  const performLogout = async (mutation: typeof logoutCurrentDeviceMutation) => {
    await mutation.mutateAsync();
    cookieUtils.deleteStorage();
  };

  return (
    <>
      <div className="p-2 sm:p-3 lg:p-4">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-5 lg:mb-6">
          {t('account.title')}
        </h1>
        <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 lg:gap-6 w-full">
            <div className="flex flex-col flex-1 min-w-0">
              <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-1 sm:mb-2">
                {t('account.info')}
              </h3>
              <h5 className="text-xs sm:text-sm font-bold mb-1">{t('account.account_area')}</h5>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {t('account.account_area_description')}
              </p>
            </div>
            <div className="flex flex-col sm:items-end sm:justify-start shrink-0">
              <h3 className="text-sm sm:text-base lg:text-lg font-bold">Việt Nam</h3>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
            <div className="flex flex-col w-full">
              <h2 className="text-base lg:text-lg font-bold">{t('auth:change_password.title')}</h2>
            </div>
            <Button
              variant="default"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => openChangePasswordDialog()}
            >
              {t('layout:header.change_password')}
            </Button>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
            <div className="flex flex-col w-full">
              <h2 className="text-base lg:text-lg font-bold">{t('auth:logout.title')}</h2>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => setOpenDialogLogout(true)}
            >
              {t('auth:logout.title')}
            </Button>
          </div>
          <div className="relative mt-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full rounded-lg border border-destructive/30 dark:border-destructive/40 bg-destructive/5 dark:bg-destructive/10 p-4 hover:border-destructive/40 dark:hover:border-destructive/50 hover:bg-destructive/8 dark:hover:bg-destructive/15">
            <div className="flex flex-col flex-1 min-w-0">
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-destructive dark:text-destructive/90 mb-1">
                {t('account.delete_account')}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground/80 leading-relaxed">
                {t('account.delete_account_description')}
              </p>
            </div>
            <div className="shrink-0 sm:ml-auto">
              <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                {t('common:button.delete')}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={openDialogLogout}
        title={t('auth:logout.title')}
        onClose={() => setOpenDialogLogout(false)}
        description={t('auth:logout.description')}
        onAccept={async () => {
          const mutation =
            logoutType === 'current' ? logoutCurrentDeviceMutation : logoutAllDevicesMutation;
          await performLogout(mutation);
          setOpenDialogLogout(false);
        }}
      >
        <div className="p-1">
          <RadioGroup
            value={logoutType}
            onValueChange={value => setLogoutType(value as 'current' | 'all')}
            className="space-y-3"
          >
            <Label
              htmlFor="logout-current-device"
              className={cn(
                'group relative flex items-start mb-0 gap-3 rounded-lg border p-4 transition-all cursor-pointer',
                'hover:border-primary/50 hover:bg-accent/50 dark:hover:bg-accent/30',
                'focus-within:ring-2 focus-within:ring-primary/20',
                logoutType === 'current'
                  ? 'border-primary/50 bg-primary/5 dark:bg-primary/10'
                  : 'border-border bg-background',
              )}
            >
              <Radio id="logout-current-device" value="current" className="mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0 space-y-1">
                <div className="font-semibold text-sm text-foreground">
                  {t('auth:logout.current_device')}
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  {t('auth:logout.current_device_description')}
                </div>
              </div>
            </Label>
            <Label
              htmlFor="logout-all-devices"
              className={cn(
                'group relative flex items-start gap-3 rounded-lg border p-4 transition-all cursor-pointer',
                'hover:border-primary/50 hover:bg-accent/50 dark:hover:bg-accent/30',
                'focus-within:ring-2 focus-within:ring-primary/20',
                logoutType === 'all'
                  ? 'border-primary/50 bg-primary/5 dark:bg-primary/10'
                  : 'border-border bg-background',
              )}
            >
              <Radio id="logout-all-devices" value="all" className="mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0 space-y-1">
                <div className="font-semibold text-sm text-foreground">
                  {t('auth:logout.all_devices')}
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  {t('auth:logout.all_devices_description')}
                </div>
              </div>
            </Label>
          </RadioGroup>
        </div>
      </Dialog>
    </>
  );
};

export default Account;
