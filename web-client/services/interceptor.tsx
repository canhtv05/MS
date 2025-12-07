'use client';

import { api, handleRedirectLogin, PREFIX_PUBLIC_ENDPOINTS } from '../utils/api';
import cookieUtils from '../utils/cookieUtils';
import { usePathname, useRouter } from 'next/navigation';
import { AxiosResponse, AxiosError } from 'axios';
import { IRefreshTokenResponse } from '@/types/auth';
import { IResponseObject } from '@/types/common';
import { isTokenValid } from '../utils/api';
import { getClientContext } from '@/utils/client-context';
import { useEffect } from 'react';

interface IApiInterceptor {
  children: React.ReactNode;
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

const ApiInterceptor = ({ children }: IApiInterceptor) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const reqInterceptor = api.interceptors.request.use(
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

        if (accessToken && isTokenValid(accessToken) && !isPublicEndpoint) {
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
        handleRedirectLogin(router, pathname);
        return Promise.reject(error);
      },
    );

    const resInterceptor = api.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
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

          const refreshToken = cookieUtils.getStorage()?.refreshToken;
          const accessToken = cookieUtils.getStorage()?.accessToken;

          if (accessToken && isTokenValid(accessToken)) {
            isRefreshing = false;
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }

          if (refreshToken && isTokenValid(refreshToken)) {
            try {
              const res: AxiosResponse<IResponseObject<IRefreshTokenResponse>> = await api.post(
                '/auth/me/p/refresh-token',
                { channel: 'web' },
                { headers: { Authorization: `Bearer ${refreshToken}` } },
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
              processQueue(refreshError as AxiosError, null);
              cookieUtils.deleteStorage();
              handleRedirectLogin(router, pathname);
              return Promise.reject(refreshError);
            } finally {
              isRefreshing = false;
            }
          }

          isRefreshing = false;
          cookieUtils.deleteStorage();
          handleRedirectLogin(router, pathname);
          return Promise.reject(error);
        }

        if (error.response?.status === 401) {
          cookieUtils.deleteStorage();
          handleRedirectLogin(router, pathname);
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, [pathname, router]);

  return <>{children}</>;
};

export default ApiInterceptor;
