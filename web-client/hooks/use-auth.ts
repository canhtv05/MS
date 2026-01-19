import { useAuthStore } from '@/stores/auth';
import cookieUtils from '@/utils/cookieUtils';

export const useAuth = () => {
  const user = useAuthStore(state => state.user);
  const isAuthenticated = cookieUtils.getAuthenticated();

  const isLoggedIn = (): boolean => {
    return isAuthenticated && !!user;
  };

  const isAdmin = (): boolean => {
    if (!user?.auth?.roles) return false;
    return user.auth.roles.some(role => role === 'ROLE_ADMIN' || role === 'ADMIN');
  };

  const hasRole = (roleName: string): boolean => {
    if (!user?.auth?.roles) return false;
    return user.auth.roles.includes(roleName);
  };

  const hasPermission = (permissionCode: string): boolean => {
    if (!user?.auth?.permissions) return false;
    return user.auth.permissions.includes(permissionCode);
  };

  const hasAnyPermission = (permissionCodes: string[]): boolean => {
    if (!user?.auth?.permissions) return false;
    return permissionCodes.some(code => user.auth.permissions.includes(code));
  };

  const hasAllPermissions = (permissionCodes: string[]): boolean => {
    if (!user?.auth?.permissions) return false;
    return permissionCodes.every(code => user.auth.permissions.includes(code));
  };

  return {
    user,
    isAuthenticated,
    isLoggedIn,
    isAdmin,
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
};
