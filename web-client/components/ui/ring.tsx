import React from 'react';
import { ClassValue } from 'clsx';

interface RingProps {
  color?: string;
  pingColor?: string;
  offlineColor?: string;
  className?: ClassValue;
  isOnline?: boolean;
  hasAnimation?: boolean;
  side?: 'right' | 'left';
  align?: 'center' | 'top' | 'bottom';
  classContainer?: ClassValue;
}

const Ring: React.FC<RingProps> = ({
  color = 'bg-emerald-500',
  pingColor = 'bg-emerald-400',
  offlineColor = 'bg-gray-500 dark:bg-gray-400',
  className = '',
  isOnline = true,
  hasAnimation = true,
  side = 'right',
  align = 'center',
  classContainer = '',
}) => {
  const positionClasses =
    align === 'center'
      ? 'left-1/2 -translate-x-1/2'
      : align === 'top'
        ? 'top-0 left-1/2 -translate-x-1/2'
        : 'bottom-0 left-1/2 -translate-x-1/2';
  const sideClasses = side === 'right' ? 'right-0' : 'left-0';
  const dotColor = isOnline ? color : offlineColor;

  return (
    <span
      className={`absolute right-0 bottom-0 flex items-center rounded-full mx-1 ${classContainer}`}
    >
      {isOnline && (
        <span
          className={`absolute inline-flex ${className} size-2 rounded-full ${pingColor} opacity-75 ${hasAnimation ? 'animate-ping' : ''} ${positionClasses} ${sideClasses}`}
        />
      )}
      <span
        className={`relative inline-flex ${className} size-2 rounded-full ${dotColor} ${positionClasses} ${sideClasses}`}
      />
    </span>
  );
};

export default Ring;
