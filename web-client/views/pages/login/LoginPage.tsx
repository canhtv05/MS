'use client';

import { Button } from '@/components/animate-ui/components/buttons/button';
import CheckBox from '@/components/customs/checkbox';
import Divider from '@/components/customs/divider';
import { Input } from '@/components/customs/input';
import Logo from '@/components/Logo';
import { FacebookIcon, GoogleIcon, TwitterIcon } from '@/public/icons';

const LoginPage = () => {
  return (
    <div
      id="login-container"
      className="min-h-screen gradient-bg relative overflow-hidden section-clickable"
    >
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div id="login-card" className="glass-effect rounded-3xl p-8 w-full max-w-md">
          <div id="logo-section" className="text-center mb-8 section-clickable">
            <div className="inline-block mb-5">
              <Logo />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-foreground text-sm">Sign in to continue your journey</p>
          </div>

          <form id="login-form" className="space-y-2 section-clickable">
            <div id="email-field" className="section-clickable">
              <Input
                id="username"
                label="Email or Username"
                placeholder="Enter your email or username"
                type="text"
                required
                validate
                inputSize="md"
              />
            </div>

            <div id="password-field" className="space-y-2 section-clickable">
              <div className="relative">
                <Input
                  id="password"
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  required
                  validate
                  inputSize="md"
                />
              </div>
            </div>

            <div id="options-section" className="flex items-center justify-between py-2">
              <CheckBox content="Remember me" />
              <a href="#" className="text-cyan-300 text-sm hover:text-cyan-200 transition-colors">
                Forgot password?
              </a>
            </div>

            <Button className="w-full rounded-full" size={'lg'}>
              Sign in
            </Button>
          </form>

          <Divider content="or continue with" />

          <div id="social-login" className="space-y-4 section-clickable">
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

            <div className="grid grid-cols-2 gap-4">
              <Button
                className="w-full rounded-lg border border-foreground/20"
                size={'lg'}
                variant={'accent'}
              >
                <div className="flex items-center gap-2 justify-center">
                  <FacebookIcon className="text-blue-400" />
                  <p className="text-foreground/80">Facebook</p>
                </div>
              </Button>

              <Button
                className="w-full rounded-lg border border-foreground/20"
                size={'lg'}
                variant={'accent'}
              >
                <div className="flex items-center gap-2 justify-center">
                  <TwitterIcon className="text-blue-400" />
                  <p className="text-foreground/80">Facebook</p>
                </div>
              </Button>
            </div>
          </div>

          <div id="signup-link" className="text-center mt-8 section-clickable">
            <p className="text-foreground/70 text-sm">
              {`Don't have an account?`}
              <a
                href="#"
                className="text-cyan-300 hover:text-cyan-200 ml-2 font-medium transition-colors"
              >
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
