'use client';

import { Button } from '@/components/animate-ui/components/buttons/button';
import { useHeaderState } from '@/views/layouts/home/use-header-state';
import { useTranslation } from 'react-i18next';

const Account = () => {
  const { t } = useTranslation('settings');
  const { openChangePasswordDialog } = useHeaderState();

  return (
    <div className="p-2 sm:p-3 lg:p-4">
      <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-5 lg:mb-6">
        {t('account.title')}
      </h1>
      <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full">
          <h3 className="text-sm sm:text-base lg:text-lg font-bold flex-1">
            {t('account.delete_account')}
          </h3>
          <Button variant="destructive" size="sm" className="w-full sm:w-auto">
            {t('common:button.delete')}
          </Button>
        </div>
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
      </div>
    </div>
  );
};

export default Account;
