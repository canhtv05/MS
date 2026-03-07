import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2Icon } from '@/components/animate-ui/icons';

interface LoadingProps {
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg';
  /** Optional text to display below spinner */
  text?: string;
  /** Additional className */
  className?: string;
  /** Full screen loading overlay */
  fullScreen?: boolean;
  /** Show icon instead of spinner */
  withIcon?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text,
  className,
  fullScreen = false,
  withIcon = true,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const spinner = withIcon ? (
    <Loader2Icon
      className={cn('animate-spin text-primary', sizeClasses[size], className)}
      role="status"
      aria-label="Loading"
    />
  ) : (
    <div
      className={cn(
        'relative inline-block',
        sizeClasses[size],
        'border-[3px]',
        'border-t-primary border-r-primary/30 border-b-primary/30 border-l-primary/30',
        'rounded-full animate-spin',
        'transition-all duration-300',
        className,
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className={cn(
          'fixed inset-0 z-50 flex flex-col items-center justify-center',
          'bg-background/80 backdrop-blur-sm',
          'transition-opacity duration-300',
        )}
      >
        {spinner}
        {text && (
          <p
            className={cn(
              'mt-4 text-foreground/70 font-medium',
              textSizeClasses[size],
              'animate-pulse',
            )}
          >
            {text}
          </p>
        )}
      </div>
    );
  }

  if (text) {
    return (
      <div className={cn('flex flex-col items-center justify-center', className)}>
        {spinner}
        <p className={cn('mt-3 text-foreground/70 font-medium', textSizeClasses[size])}>{text}</p>
      </div>
    );
  }

  return spinner;
};

export default Loading;
