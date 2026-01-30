'use client';

import { Button } from '@/components/animate-ui/components/buttons/button';
import { Input } from '@/components/ui/input';
import Logo from '@/components/Logo';
import useForgotPassword from './use-forgot-password';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Letter } from '@solar-icons/react-perf/Linear';
import { InputOTP } from '@/components/ui/input-otp';
import { AltArrowLeft } from '@solar-icons/react-perf/Outline';
import { LockPasswordUnlocked, LockPassword } from '@solar-icons/react-perf/Outline';

const ForgotPasswordPage = () => {
  const {
    onSubmitForgotPassword,
    forgotPasswordForm,
    navigateSignIn,
    type,
    onSubmitVerifyForgotPassword,
    verifyForgotPasswordOtpForm,
    onSubmitResetPassword,
    resetPasswordForm,
  } = useForgotPassword();
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

        {type === 'FORGOT' && (
          <form
            onSubmit={forgotPasswordForm.handleSubmit(onSubmitForgotPassword)}
            id="forgot-password-form"
            className="space-y-2 flex flex-col gap-1 section-clickable"
          >
            <Controller
              name="email"
              control={forgotPasswordForm.control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  id="email"
                  label={t('forgot_password.email_address')}
                  placeholder={t('forgot_password.enter_your_email_address')}
                  icon={<Letter className="size-5 p-0.5 text-foreground/70" />}
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
        )}

        {type === 'VERIFY' && (
          <form
            onSubmit={verifyForgotPasswordOtpForm.handleSubmit(onSubmitVerifyForgotPassword)}
            id="verify-otp-form"
            className="space-y-2 flex flex-col gap-1 section-clickable"
          >
            <Controller
              name="email"
              control={verifyForgotPasswordOtpForm.control}
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <Controller
              name="OTP"
              control={verifyForgotPasswordOtpForm.control}
              render={({ field, fieldState }) => (
                <InputOTP
                  pattern="^[0-9]*$"
                  {...field}
                  maxLength={6}
                  label={t('verify_forgot_password_otp.otp')}
                  required
                  id="otp"
                  errorText={fieldState?.error?.message}
                />
              )}
            />
            <Button className="w-full rounded-full" size={'lg'} type="submit">
              {t('verify_forgot_password_otp.verify_otp')}
            </Button>
          </form>
        )}

        {type === 'RESET' && (
          <form
            onSubmit={resetPasswordForm.handleSubmit(onSubmitResetPassword)}
            id="verify-otp-form"
            className="space-y-2 flex flex-col gap-1 section-clickable"
          >
            <Controller
              name="email"
              control={resetPasswordForm.control}
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <Controller
              name="OTP"
              control={resetPasswordForm.control}
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <Controller
              name="newPassword"
              control={resetPasswordForm.control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  id="password"
                  label={t('reset_password.new_password')}
                  placeholder="••••••••"
                  type="password"
                  required
                  validate
                  inputSize="md"
                  icon={<LockPassword className="size-5 p-0.5 text-foreground/70" />}
                  errorText={fieldState?.error?.message}
                />
              )}
            />
            <Controller
              name="confirmPassword"
              control={resetPasswordForm.control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  id="confirmPassword"
                  label={t('reset_password.confirm_password')}
                  placeholder="••••••••"
                  type="password"
                  required
                  validate
                  inputSize="md"
                  icon={<LockPasswordUnlocked className="size-5 p-0.5 text-foreground/70" />}
                  errorText={fieldState?.error?.message}
                />
              )}
            />
            <Button className="w-full rounded-full" size={'lg'} type="submit">
              {t('reset_password.reset_password')}
            </Button>
          </form>
        )}

        <div id="social-sign-in" className="space-y-4 pt-5 section-clickable">
          <Button
            className="w-full text-cyan-300 text-sm hover:text-cyan-200"
            size={'lg'}
            variant={'ghost'}
            onClick={navigateSignIn}
          >
            <div className="flex items-center gap-2 justify-center">
              <AltArrowLeft />
              <p>{t('forgot_password.back_to_sign_in')}</p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
