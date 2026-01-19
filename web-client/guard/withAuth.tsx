import React from 'react';
import ProtectedRoute, { RouteAccessLevel } from '@/guard/ProtectedRoute';

export function withAuth<P extends object>(
  Component: React.FC<P>,
  options?: {
    accessLevel?: RouteAccessLevel;
    redirectTo?: string;
    showLoading?: boolean;
  },
) {
  const WrappedComponent: React.FC<P> = props => {
    return (
      <ProtectedRoute
        accessLevel={options?.accessLevel || 'authenticated'}
        redirectTo={options?.redirectTo}
        showLoading={options?.showLoading}
      >
        <Component {...props} />
      </ProtectedRoute>
    );
  };

  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}
