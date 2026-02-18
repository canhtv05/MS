'use client';

import { ReactNode } from 'react';
import { api } from '@/utils/api';
import cookieUtils from '@/utils/cookieUtils';
import { getClientContext } from '@/utils/client-context';
import { logger } from '@/lib/logger';
import { routes } from '@/configs/routes';

interface IApiInterceptor {
  children: ReactNode;
}

const redirectToSignIn = () => {
  if (typeof window === 'undefined') return;

  const currentPath = window.location.pathname + window.location.search;
  const search = `?returnUrl=${encodeURIComponent(currentPath)}`;

  window.location.href = `${routes.auth.signIn}${search}`;
};

const handleLogout = (clearAll = false) => {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useAuthStore } = require('@/stores/auth');

    if (clearAll) {
      useAuthStore.getState().setUser(undefined);
      cookieUtils.clearAuthenticated();
      redirectToSignIn();
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
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => response,
  async error => {
    const status = error.response?.status;

    // gateway xử lý refresh token – nếu vẫn trả 401 thì coi như hết hạn phiên đăng nhập
    if (status === 401) {
      logger.log('[Interceptor] Unauthorized (401), logging out');
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
