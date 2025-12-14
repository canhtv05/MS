'use client';

import { api, handleRedirectLogin, PREFIX_PUBLIC_ENDPOINTS } from '@/utils/api';
import cookieUtils from '../utils/cookieUtils';
import { AxiosResponse, AxiosError } from 'axios';
import { IRefreshTokenResponse } from '@/types/auth';
import { IResponseObject } from '@/types/common';
import { getClientContext } from '@/utils/client-context';
import { ReactNode } from 'react';
import { setAuthRefreshing } from '@/guard/AuthRefreshContext';

interface IApiInterceptor {
  children: ReactNode;
}

interface IFailedRequestQueue {
  resolve: (value: string | null) => void;
  reject: (reason?: AxiosError) => void;
}

let isRefreshing = false;
let failedQueue: IFailedRequestQueue[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const handleLogout = (clearAll = false) => {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useAuthStore } = require('@/stores/auth');

    if (clearAll) {
      useAuthStore.getState().setUser(undefined);
      cookieUtils.deleteStorage();
      handleRedirectLogin(true);
    } else {
      cookieUtils.deleteAccessToken();
    }
  }
};

api.interceptors.request.use(
  async config => {
    const ctx = await getClientContext();
    const accessToken = cookieUtils.getStorage()?.accessToken;

    const isPublicEndpoint = PREFIX_PUBLIC_ENDPOINTS.some(pattern => {
      if (pattern.endsWith('/**')) {
        const baseRoute = pattern.replace('/**', '');
        return config.url?.startsWith(baseRoute);
      }
      return config.url === pattern;
    });

    if (accessToken && !isPublicEndpoint) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (config.method !== 'get') {
      config.data = {
        ...(config.data ?? {}),
        ...ctx,
      };
    }

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
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      setAuthRefreshing(true);

      try {
        const storage = cookieUtils.getStorage();
        const refreshToken = storage?.refreshToken;

        if (!refreshToken) {
          console.error('[Interceptor] No refresh token found, logging out');
          handleLogout(true);
          return Promise.reject(new Error('No refresh token'));
        }

        const res: AxiosResponse<IResponseObject<IRefreshTokenResponse>> = await api.post(
          '/auth/me/p/refresh-token',
          { channel: 'web' },
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        );

        const { accessToken, refreshToken: newRefresh } = res.data.data;
        cookieUtils.setStorage({
          accessToken,
          refreshToken: newRefresh,
        });

        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('[Interceptor] Refresh failed, logging out');
        processQueue(refreshError as AxiosError, null);
        handleLogout(true);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        setAuthRefreshing(false);
      }
    }

    return Promise.reject(error);
  },
);

const ApiInterceptor = ({ children }: IApiInterceptor) => {
  return <>{children}</>;
};

export default ApiInterceptor;
