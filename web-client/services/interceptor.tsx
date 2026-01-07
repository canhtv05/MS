'use client';

import { api, handleRedirectLogin } from '@/utils/api';
import cookieUtils from '../utils/cookieUtils';
import { getClientContext } from '@/utils/client-context';
import { ReactNode } from 'react';

interface IApiInterceptor {
  children: ReactNode;
}

const handleLogout = (clearAll = false) => {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useAuthStore } = require('@/stores/auth');

    if (clearAll) {
      useAuthStore.getState().setUser(undefined);
      cookieUtils.clearAuthenticated();
      handleRedirectLogin(true);
    } else {
      cookieUtils.clearAuthenticated();
    }
  }
};

api.interceptors.request.use(
  async config => {
    const ctx = await getClientContext();
    if (config.method !== 'get') {
      if (config.data instanceof FormData) {
        Object.entries(ctx).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            config.data.append(key, value as string);
          }
        });
      } else {
        config.data = {
          ...(config.data ?? {}),
          ...ctx,
        };
      }
    }

    config.headers['X-Channel'] = 'web';
    return config;
  },
  error => {
    handleRedirectLogin();
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => response,
  async error => {
    // gateway xử lý refresh token
    if (error.response?.status === 401) {
      console.log('[Interceptor] Unauthorized (401), logging out');
      handleLogout(true);
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

const ApiInterceptor = ({ children }: IApiInterceptor) => {
  return <>{children}</>;
};

export default ApiInterceptor;
