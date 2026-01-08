'use client';

import { ReactNode } from 'react';

interface ProfilePageWrapper {
  children: ReactNode;
  title?: string;
}

const ProfilePageWrapper = ({ children, title }: ProfilePageWrapper) => {
  return (
    <div className="md:px-6 px-4 md:py-6 py-4 custom-bg-1 rounded-md shadow-[0_0_10px_0_rgba(0,0,0,0.07)]">
      {!!title && <h3 className="font-black text-[16px]">{title}</h3>}
      {children}
    </div>
  );
};

export default ProfilePageWrapper;
