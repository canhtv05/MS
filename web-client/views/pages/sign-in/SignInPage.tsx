'use client';

import { Button } from '@/components/animate-ui/components/buttons/button';
import CheckBox from '@/components/customs/checkbox';
import Divider from '@/components/customs/divider';
import { Input } from '@/components/customs/input';
import Logo from '@/components/Logo';
import { GoogleIcon, LockIcon, UserIcon } from '@/public/icons';
import Link from 'next/link';
import useSignIn from './use-signin';
import { Controller } from 'react-hook-form';

const SignInPage = () => {
  const { onSubmit, form } = useSignIn();

  return (
    <div
      id="sing-in-card"
      className="glass-effect h-full rounded-xl p-10 w-full lg:min-w-md max-w-md"
    >
      <div id="logo-section" className="text-center mb-8 section-clickable">
        <div className="inline-block mb-5">
          <Logo />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
        <p className="text-foreground text-sm">Sign in to continue your journey</p>
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
              label="Email or Username"
              placeholder="Enter your email or username"
              icon={<UserIcon className="size-5 p-0.5 text-foreground/70" />}
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
              label="Password"
              placeholder="Enter your password"
              type="password"
              icon={<LockIcon className="size-5 p-0.5 text-foreground/70" />}
              inputSize="md"
              errorText={fieldState?.error?.message}
              validate
              required
            />
          )}
        />

        <div id="options-section" className="flex items-center justify-between py-2">
          <CheckBox content="Remember me" tabIndex={-1} />
          <a
            href="#"
            className="text-cyan-300 text-sm hover:text-cyan-200 transition-colors"
            tabIndex={-1}
          >
            Forgot password?
          </a>
        </div>

        <Button className="w-full rounded-full" size={'lg'} type="submit">
          Sign in
        </Button>
      </form>

      <Divider content="or continue with" />

      <div id="social-sing-in" className="space-y-4 section-clickable">
        <Button
          className="w-full rounded-lg border border-foreground/20"
          size={'lg'}
          variant={'accent'}
        >
          <div className="flex items-center gap-2 justify-center">
            <GoogleIcon className="text-red-400" />
            <p className="text-foreground/80">Continue with Google</p>
          </div>
        </Button>
      </div>

      <div id="signup-link" className="text-center mt-8 section-clickable">
        <p className="text-foreground/70 text-sm">
          {`Don't have an account?`}
          <Link
            href="/sign-up"
            className="text-cyan-300 hover:text-cyan-200 ml-2 font-medium transition-colors"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
