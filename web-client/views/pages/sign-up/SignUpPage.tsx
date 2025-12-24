'use client';

import { Button } from '@/components/animate-ui/components/buttons/button';
import Divider from '@/components/customs/divider';
import { Input } from '@/components/customs/input';
import Logo from '@/components/Logo';
import { GoogleIcon } from '@/components/animate-ui/icons';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import useSignUp from './use-signup';
import { Controller } from 'react-hook-form';
import { User, LockPassword, Letter, LockPasswordUnlocked } from '@solar-icons/react-perf/Bold';

const SignUpPage = () => {
  const { onSubmit, form } = useSignUp();
  const { t } = useTranslation('auth');

  return (
    <div
      id="sing-up-card"
      className="glass-effect h-full rounded-xl p-10 w-full lg:min-w-md max-w-md"
    >
      <div id="logo-section" className="text-center mb-8 section-clickable">
        <div className="inline-block mb-5">
          <Logo />
        </div>
        <h1 className="text-[22px] font-bold text-foreground mb-2">{t('sign_up.title')}</h1>
        <p className="text-foreground text-sm">{t('sign_up.description')}</p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        id="sing-up-form"
        className="space-y-2 flex flex-col gap-1 section-clickable"
      >
        <Controller
          name="fullname"
          control={form.control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              id="fullname"
              label={t('sign_up.full_name')}
              placeholder="John Doe"
              type="text"
              required
              validate
              inputSize="md"
              errorText={fieldState?.error?.message}
              icon={<User className="size-5 p-0.5 text-foreground/70" />}
            />
          )}
        />
        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Input
              id="username"
              label={t('sign_up.username')}
              placeholder="johndoe_123"
              type="text"
              required
              validate
              inputSize="md"
              errorText={fieldState.error?.message}
              icon={<User className="size-5 p-0.5 text-foreground/70" />}
              value={field.value}
              onChange={e => {
                const raw = e.target.value;
                const sanitized = raw.replace(/[^a-zA-Z0-9_]/g, '');
                field.onChange(sanitized);
              }}
            />
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              id="email"
              label={t('sign_up.email')}
              placeholder="john@gmail.com"
              type="text"
              required
              validate
              inputSize="md"
              icon={<Letter className="size-5 p-0.5 text-foreground/70" />}
              errorText={fieldState?.error?.message}
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
              label={t('sign_up.password')}
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
          control={form.control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              id="confirmPassword"
              label={t('sign_up.confirm_password')}
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

        <Button className="w-full rounded-full mt-2" size={'lg'}>
          {t('sign_up.sign_up_button')}
        </Button>
      </form>

      <Divider content={t('sign_up.or_continue_with')} />

      <div id="social-sing-up" className="space-y-4 section-clickable">
        <Button
          className="w-full rounded-lg border border-foreground/20"
          size={'lg'}
          variant={'accent'}
        >
          <div className="flex items-center gap-2 justify-center">
            <GoogleIcon className="text-red-400" />
            <p className="text-foreground/80">{t('sign_up.continue_with_google')}</p>
          </div>
        </Button>
      </div>

      <div id="signup-link" className="text-center mt-8 section-clickable">
        <p className="text-foreground/70 text-sm">
          {t('sign_up.already_have_account')}
          <Link href="/sign-in" className="text-cyan-300 hover:text-cyan-200 ml-2 font-medium">
            {t('sign_up.sign_in_here')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
