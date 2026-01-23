'use client';

import Show from '@/components/Show';
import { ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
  title?: string;
  description?: string;
  button?: ReactNode;
  isLoading?: boolean;
  fallback?: ReactNode;
  className?: string;
}

const Wrapper = ({
  children,
  title,
  description,
  button,
  isLoading,
  fallback,
  className,
}: WrapperProps) => {
  return (
    <Show when={!isLoading} fallback={fallback}>
      <div
        className={`p-(--sp-card) flex-1 h-auto custom-bg-1 rounded-md shadow-[0_0_10px_0_rgba(0,0,0,0.07)] mb-0 ${className || ''}`}
      >
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
    </Show>
  );
};

export default Wrapper;
