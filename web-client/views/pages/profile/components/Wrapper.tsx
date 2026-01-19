'use client';

import { ReactNode } from 'react';

interface Wrapper {
  children: ReactNode;
  title?: string;
  description?: string;
  button?: ReactNode;
}

const Wrapper = ({ children, title, description, button }: Wrapper) => {
  return (
    <div className="p-3 flex-1 h-auto custom-bg-1 rounded-md shadow-[0_0_10px_0_rgba(0,0,0,0.07)] mb-0">
      {!!title && (
        <div className="flex items-center justify-between mb-2">
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

export default Wrapper;
