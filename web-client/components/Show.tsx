'use client';

import { ReactNode } from 'react';

interface IShowProps {
  when: boolean | undefined;
  children: ReactNode;
  fallback?: ReactNode;
}

const Show = ({ when, children, fallback }: IShowProps) => {
  return when === undefined ? null : when ? <>{children}</> : <>{fallback}</>;
};

export default Show;
