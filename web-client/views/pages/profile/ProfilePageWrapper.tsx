'use client';

import { ReactNode } from 'react';

interface ProfilePageWrapper {
  children: ReactNode;
  title?: string;
  description?: string;
  button?: ReactNode;
}

const ProfilePageWrapper = ({ children, title, description, button }: ProfilePageWrapper) => {
  return (
    <div className="p-4 flex-1 custom-bg-1 rounded-md shadow-[0_0_10px_0_rgba(0,0,0,0.07)] mb-0">
      {!!title && (
        <div className="flex items-center justify-between">
          <div className="flex items-start justify-start flex-col">
            <h3 className="font-black text-[16px]">{title}</h3>
            {!!description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          {button}
        </div>
      )}
      {children}
    </div>
  );
};

export default ProfilePageWrapper;
