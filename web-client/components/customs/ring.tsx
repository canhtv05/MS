import React from 'react';

interface RingProps {
  color?: string;
  pingColor?: string;
  className?: string;
  isOnline?: boolean;
  hasAnimation?: boolean;
  side?: 'right' | 'left';
  align?: 'center' | 'top' | 'bottom';
}

const Ring: React.FC<RingProps> = ({
  color = 'bg-emerald-500',
  pingColor = 'bg-emerald-400',
  className = '',
  isOnline = true,
  hasAnimation = true,
  side = 'right',
  align = 'center',
}) => {
  return (
    <span className={`relative flex items-center justify-between rounded-full mx-1 ${className}`}>
      {isOnline && (
        <span
          className={`absolute inline-flex size-2 rounded-full ${isOnline ? pingColor : 'bg-gray-600 dark:bg-gray-400'} opacity-75 ${hasAnimation ? 'animate-ping' : ''} ${align === 'center' ? 'left-1/2 -translate-x-1/2' : align === 'top' ? 'top-0 left-1/2 -translate-x-1/2' : align === 'bottom' ? 'bottom-0 left-1/2 -translate-x-1/2' : ''} ${side === 'right' ? 'right-0' : side === 'left' ? 'left-0' : ''}`}
        ></span>
      )}
      <span
        className={`relative inline-flex size-2 rounded-full ${isOnline ? color : 'bg-gray-600 dark:bg-gray-400'} ${align === 'center' ? 'left-1/2 -translate-x-1/2' : align === 'top' ? 'top-0 left-1/2 -translate-x-1/2' : align === 'bottom' ? 'bottom-0 left-1/2 -translate-x-1/2' : ''} ${side === 'right' ? 'right-0' : side === 'left' ? 'left-0' : ''}`}
      ></span>
    </span>
  );
};

export default Ring;
