import React from 'react';

interface RingProps {
  color?: string;
  pingColor?: string;
  className?: string;
}

const Ring: React.FC<RingProps> = ({
  color = 'bg-emerald-500',
  pingColor = 'bg-emerald-400',
  className = '',
}) => {
  return (
    <span className={`relative flex items-center justify-between rounded-full mx-1 ${className}`}>
      <span
        className={`absolute inline-flex size-2 rounded-full ${pingColor} opacity-75 animate-ping`}
      ></span>
      <span className={`relative inline-flex size-2 rounded-full ${color}`}></span>
    </span>
  );
};

export default Ring;
