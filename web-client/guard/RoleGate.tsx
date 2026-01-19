'use client';

import { ReactNode } from 'react';
import { useAuth } from '../hooks/use-auth';

interface IRoleGate {
  children: ReactNode;
  allowedRoles?: string[];
  allowedPermissions?: string[];
  fallback?: ReactNode;
  requireAuth?: boolean;
}

const RoleGate = ({
  children,
  allowedRoles = [],
  allowedPermissions = [],
  fallback = null,
  requireAuth = false,
}: IRoleGate) => {
  const { isLoggedIn, hasRole, hasAnyPermission } = useAuth();

  if (requireAuth && !isLoggedIn()) {
    return <>{fallback}</>;
  }

  if (allowedRoles.length === 0 && allowedPermissions.length === 0) {
    return <>{children}</>;
  }

  if (allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.some(role => hasRole(role));
    if (!hasRequiredRole) {
      return <>{fallback}</>;
    }
  }

  if (allowedPermissions.length > 0) {
    const hasRequiredPermission = hasAnyPermission(allowedPermissions);
    if (!hasRequiredPermission) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};

export default RoleGate;
