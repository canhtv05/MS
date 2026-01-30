'use client';

import { Button } from '@/components/animate-ui/components/buttons/button';
import CheckBox from '@/components/ui/checkbox';
import Divider from '@/components/ui/divider';
import { Input } from '@/components/ui/input';
import Logo from '@/components/Logo';
import { GoogleIcon } from '@/components/animate-ui/icons';
import Link from 'next/link';
import useSignIn from './use-signin';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Dialog from '@/components/ui/dialog';
import { User, LockPassword } from '@solar-icons/react-perf/Bold';

const SignInPage = () => {
  const { onSubmit, form, setShowResendEmail, showResendEmail, handleResendVerifyEmail } =
    useSignIn();
  const { t } = useTranslation(['auth', 'notification']);

  return (
    <>
      <div
        id="sing-in-card"
        className="glass-effect h-full rounded-xl p-10 w-full lg:min-w-md max-w-md"
      >
        <div id="logo-section" className="text-center mb-8 section-clickable">
          <div className="inline-block mb-5">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{t('sign_in.welcome_back')}</h1>
          <p className="text-foreground text-sm">{t('sign_in.description')}</p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="sing-in-form"
          className="space-y-2 flex flex-col gap-1 section-clickable"
        >
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                id="username"
                label={t('sign_in.label_email_or_username')}
                placeholder={t('sign_in.email_or_username')}
                icon={<User className="size-5 p-0.5 text-foreground/70" />}
                inputSize="md"
                errorText={fieldState?.error?.message}
                validate
                required
              />
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                id="password"
                label={t('sign_in.label_password')}
                placeholder={t('sign_in.password')}
                type="password"
                icon={<LockPassword className="size-5 p-0.5 text-foreground/70" />}
                inputSize="md"
                errorText={fieldState?.error?.message}
                validate
                required
              />
            )}
          />

          <div id="options-section" className="flex items-center justify-between py-2">
            <CheckBox content={t('sign_in.remember_me')} tabIndex={-1} />
            <Link
              href="/forgot-password"
              className="text-cyan-300 text-sm hover:text-cyan-200"
              tabIndex={-1}
            >
              {t('sign_in.forgot_password')}
            </Link>
          </div>

          <Button className="w-full rounded-full" size={'lg'} type="submit">
            {t('sign_in.sign_in_button')}
          </Button>
        </form>

        <Divider content={t('sign_in.or_continue_with')} />

        <div id="social-sing-in" className="space-y-4 section-clickable">
          <Button
            className="w-full rounded-lg border border-foreground/20"
            size={'lg'}
            variant={'accent'}
          >
            <div className="flex items-center gap-2 justify-center">
              <GoogleIcon className="text-red-400" />
              <p className="text-foreground/80">{t('sign_in.continue_with_google')}</p>
            </div>
          </Button>
        </div>

        <div id="signup-link" className="text-center mt-8 section-clickable">
          <p className="text-foreground/70 text-sm">
            {t('sign_in.no_account')}
            <Link href="/sign-up" className="text-cyan-300 hover:text-cyan-200 ml-2 font-medium">
              {t('sign_in.sign_up_here')}
            </Link>
          </p>
        </div>
      </div>
      <Dialog
        open={showResendEmail}
        title={t('notification:resend_verify_email.title')}
        onClose={() => setShowResendEmail(false)}
        description={t('notification:resend_verify_email.description')}
        onAccept={() => {
          handleResendVerifyEmail();
          setShowResendEmail(false);
        }}
      />
    </>
  );
};

export default SignInPage;
