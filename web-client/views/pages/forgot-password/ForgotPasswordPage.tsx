'use client';

import { Button } from '@/components/animate-ui/components/buttons/button';
import { Input } from '@/components/customs/input';
import Logo from '@/components/Logo';
import useForgotPassword from './use-forgot-password';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
import { AnimateIcon } from '@/components/animate-ui/icons/icon';
import { ChevronLeft } from '@/components/animate-ui/icons/chevron-left';

const ForgotPasswordPage = () => {
  const { onSubmit, form, navigateSignIn } = useForgotPassword();
  const { t } = useTranslation('auth');

  return (
    <div className="flex items-center justify-center">
      <div
        id="forgot-password-card"
        className="glass-effect h-full rounded-xl p-10 w-full lg:min-w-md max-w-md"
      >
        <div id="logo-section" className="text-center mb-8 section-clickable">
          <div className="inline-block mb-5">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{t('forgot_password.title')}</h1>
          <p className="text-foreground text-sm">{t('forgot_password.description')}</p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="forgot-password-form"
          className="space-y-2 flex flex-col gap-1 section-clickable"
        >
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                id="email"
                label={t('forgot_password.email_address')}
                placeholder={t('forgot_password.enter_your_email_address')}
                icon={<Mail className="size-5 p-0.5 text-foreground/70" />}
                inputSize="md"
                errorText={fieldState?.error?.message}
                validate
                required
              />
            )}
          />

          <Button className="w-full rounded-full" size={'lg'} type="submit">
            {t('forgot_password.send_reset_password_email')}
          </Button>
        </form>

        <div id="social-sign-in" className="space-y-4 pt-5 section-clickable">
          <AnimateIcon animateOnHover>
            <Button
              className="w-full text-cyan-300 text-sm hover:text-cyan-200 transition-colors"
              size={'lg'}
              variant={'ghost'}
              onClick={navigateSignIn}
            >
              <div className="flex items-center gap-2 justify-center">
                <ChevronLeft />
                <p>{t('forgot_password.back_to_sign_in')}</p>
              </div>
            </Button>
          </AnimateIcon>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
