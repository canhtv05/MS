'use client';

import Show from '@/components/Show';
import { ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

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
    <Show when={!isLoading || !fallback} fallback={fallback}>
      <div className={`p-(--sp-card) flex-1 h-auto custom-bg-1 rounded-md mb-0 ${className || ''}`}>
        {!!title && (
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-start justify-start flex-col">
              <Show when={!isLoading} fallback={<Skeleton className="h-5 w-32" />}>
                <h3 className="font-black text-[16px]">{title}</h3>
              </Show>
              <Show when={!!description && !isLoading}>
                <p className="text-xs text-muted-foreground">{description}</p>
              </Show>
            </div>
            <Show when={!isLoading}>{button}</Show>
          </div>
        )}
        {children}
      </div>
    </Show>
  );
};

export default Wrapper;
