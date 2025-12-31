'use client';

import { api, handleRedirectLogin } from '@/utils/api';
import cookieUtils from '../utils/cookieUtils';
import { AxiosError } from 'axios';
import { getClientContext } from '@/utils/client-context';
import { ReactNode } from 'react';
import { setAuthRefreshing } from '@/guard/AuthRefreshContext';
import { API_ENDPOINTS } from '@/configs/endpoints';

interface IApiInterceptor {
  children: ReactNode;
}

interface IFailedRequestQueue {
  resolve: () => void;
  reject: (reason?: AxiosError) => void;
}

let isRefreshing = false;
let failedQueue: IFailedRequestQueue[] = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
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

    // Không kiểm tra isAuthenticated ở đây vì cookie httpOnly
    // Gateway sẽ tự đính kèm token từ cookie

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

    // Kiểm tra nếu đây là endpoint refresh-token bị lỗi thì logout luôn
    if (originalRequest.url?.includes('/refresh-token') && error.response?.status === 401) {
      console.log('[Interceptor] Refresh token expired, logging out');
      handleLogout(true);
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      // Nếu đã thử retry rồi thì không retry nữa
      if (originalRequest._retry) {
        handleLogout(true);
        return Promise.reject(error);
      }

      // Kiểm tra xem user có đang authenticated không
      const isAuthenticated = cookieUtils.getAuthenticated();
      if (!isAuthenticated) {
        console.log('[Interceptor] User not authenticated, skipping refresh');
        return Promise.reject(error);
      }

      // Nếu đang refresh thì queue request lại
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // Không cần set Authorization header vì gateway sẽ lấy từ cookie
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
        await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {});
        cookieUtils.setAuthenticated(true);
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        console.log('[Interceptor] Refresh failed, logging out');
        processQueue(refreshError as AxiosError);
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
