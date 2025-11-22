import axios from 'axios';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { BASE_URL } from './endpoints';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import cookieUtils from './cookieUtils';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const PUBLIC_ENDPOINS: string[] = ['/me/p/authenticate', '/me/c/create'];
export const PREFIX_PUBLIC_ENDPOINTS = PUBLIC_ENDPOINS.map(endpoint => `/auth${endpoint}`);

export const handleRedirectLogin = (nextRouter: AppRouterInstance, pathname: string) => {
  if (pathname !== '/home' && pathname !== '/sign-in' && pathname !== '/landing') {
    nextRouter.push(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
  } else {
    nextRouter.replace('/sign-in');
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
