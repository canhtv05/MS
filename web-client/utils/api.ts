import axios from 'axios';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { BASE_URL } from './endpoints';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import cookieUtils from './cookieUtils';
import { PUBLIC_ROUTERS } from './common';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const apiHandler = async <T>(promise: Promise<{ data: T }>) => {
  return promise
    .then(res => [undefined, res.data] as const)
    .catch(err => [err, undefined] as const);
};

export const AUTH_PUBLIC_ENDPOINTS: string[] = ['/me/p/authenticate', '/me/c/create'];
export const NOTIFICATION_PUBLIC_ENDPOINTS: string[] = ['/verify-email'];
export const PREFIX_PUBLIC_ENDPOINTS = [
  ...AUTH_PUBLIC_ENDPOINTS.map(endpoint => `/auth${endpoint}`),
  ...NOTIFICATION_PUBLIC_ENDPOINTS.map(endpoint => `/notifications${endpoint}`),
];

export const handleRedirectLogin = (nextRouter: AppRouterInstance, pathname: string) => {
  if (!PUBLIC_ROUTERS.includes(pathname)) {
    nextRouter.push(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
  }
  cookieUtils.deleteStorage();
};

export const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp! > Date.now() / 1000;
  } catch {
    return false;
  }
};
