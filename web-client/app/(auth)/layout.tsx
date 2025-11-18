'use client';

import Image from 'next/image';
import { ReactNode } from 'react';

interface IAuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: IAuthLayoutProps) => {
  return (
    <div
      id="login-container"
      className="min-h-screen relative overflow-hidden section-clickable flex"
    >
      <div className="flex items-center h-full justify-center relative z-10 order-1 lg:px-10 px-0 lg:flex-none flex-1">
        {children}
      </div>
      <div className="lg:flex hidden basis-auto grow justify-start order-2 p-5">
        <div className="relative w-full h-full rounded-lg overflow-hidden">
          <Image
            src={'/imgs/bg-login.png'}
            fill
            alt="Sign in page image"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
