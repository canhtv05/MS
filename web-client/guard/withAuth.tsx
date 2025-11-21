import React from 'react';
import AuthRoute from '@/guard/AuthRoute';

export function withAuth<P extends object>(Component: React.FC<P>) {
  const WrappedComponent: React.FC<P> = props => {
    return (
      <AuthRoute>
        <Component {...props} />
      </AuthRoute>
    );
  };

  return WrappedComponent;
}
