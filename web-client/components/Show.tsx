'use client';

import { ReactNode } from 'react';

interface IShowProps {
  when: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

const Show = ({ when, children, fallback }: IShowProps) => {
  return when ? <>{children}</> : <>{fallback}</>;
};

export default Show;
