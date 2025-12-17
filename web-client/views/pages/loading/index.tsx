'use client';

import Logo from '@/components/Logo';

const LoadingPage = () => {
  return (
    <div className="flex fixed inset-0 z-9999 items-center justify-center h-screen w-screen bg-background">
      <Logo />
    </div>
  );
};

export default LoadingPage;
