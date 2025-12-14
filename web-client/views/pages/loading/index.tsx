'use client';

import Logo from '@/components/Logo';

const LoadingPage = () => {
  return (
    <div className="flex fixed top-0 left-0 right-0 z-[9999] bottom-0 items-center justify-center h-screen bg-background">
      <Logo />
    </div>
  );
};

export default LoadingPage;
