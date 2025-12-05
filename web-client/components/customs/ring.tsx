import React from 'react';

interface RingProps {
  color?: string;
  pingColor?: string;
  className?: string;
  isOnline?: boolean;
  hasAnimation?: boolean;
}

const Ring: React.FC<RingProps> = ({
  color = 'bg-emerald-500',
  pingColor = 'bg-emerald-400',
  className = '',
  isOnline = true,
  hasAnimation = true,
}) => {
  return (
    <span className={`relative flex items-center justify-between rounded-full mx-1 ${className}`}>
      {isOnline && (
        <span
          className={`absolute inline-flex size-2 rounded-full ${isOnline ? pingColor : 'bg-gray-600 dark:bg-gray-400'} opacity-75 ${hasAnimation ? 'animate-ping' : ''}`}
        ></span>
      )}
      <span
        className={`relative inline-flex size-2 rounded-full ${isOnline ? color : 'bg-gray-600 dark:bg-gray-400'}`}
      ></span>
    </span>
  );
};

export default Ring;
