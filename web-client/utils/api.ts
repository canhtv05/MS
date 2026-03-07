import axios from 'axios';
import { API_FRONTEND_URL } from '@/configs/endpoints';
import { routes } from '@/configs/routes';
import cookieUtils from './cookieUtils';
import { PUBLIC_ROUTERS } from './common';

export const api = axios.create({
  baseURL: API_FRONTEND_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
  // withCredentials: true,
});

export const apiHandler = async <T>(promise: Promise<{ data: T }>) => {
  return promise
    .then(res => [undefined, res.data] as const)
    .catch(err => [err, undefined] as const);
};

export const AUTH_PUBLIC_ENDPOINTS: string[] = [
  '/me/p/authenticate',
  '/me/c/create',
  '/me/p/forgot-password',
  '/me/p/reset-password',
  '/me/p/verify-forgot-password-otp',
];
export const NOTIFICATION_PUBLIC_ENDPOINTS: string[] = ['/verify-email', '/resend-verify-email'];
export const PROFILE_PUBLIC_ENDPOINTS: string[] = ['/profile/**'];
export const PREFIX_PUBLIC_ENDPOINTS = [
  ...AUTH_PUBLIC_ENDPOINTS.map(endpoint => `/auth${endpoint}`),
  ...NOTIFICATION_PUBLIC_ENDPOINTS.map(endpoint => `/notifications${endpoint}`),
  ...PROFILE_PUBLIC_ENDPOINTS.map(endpoint => `/user-profile${endpoint}`),
];

export const handleRedirectLogin = (clearStorage = true) => {
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname + window.location.search;
    if (PUBLIC_ROUTERS.some(route => currentPath.startsWith(route))) {
      return;
    }
    if (clearStorage) {
      cookieUtils.deleteStorage();
    }
    window.location.href = `${routes.auth.signIn}?returnUrl=${encodeURIComponent(currentPath)}`;
  }
};
