'use client';

import { api, handleRedirectLogin, PREFIX_PUBLIC_ENDPOINTS } from '../utils/api';
import cookieUtils from '../utils/cookieUtils';
import { usePathname, useRouter } from 'next/navigation';
import { AxiosResponse } from 'axios';
import { IRefreshTokenResponse } from '@/types/auth';
import { IResponseObject } from '@/types/common';
import { isTokenValid } from '../utils/api';
import { getClientContext } from '@/utils/client-context';

interface IApiInterceptor {
  children: React.ReactNode;
}

const ApiInterceptor = ({ children }: IApiInterceptor) => {
  const router = useRouter();
  const pathname = usePathname();

  api.interceptors.request.use(
    async config => {
      const ctx = await getClientContext();
      const accessToken = cookieUtils.getStorage()?.accessToken;

      if (
        accessToken &&
        isTokenValid(accessToken) &&
        !PREFIX_PUBLIC_ENDPOINTS.some(route => config.url?.includes(route))
      ) {
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
    () => handleRedirectLogin(router, pathname),
  );

  api.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = cookieUtils.getStorage()?.refreshToken;
        const accessToken = cookieUtils.getStorage()?.accessToken;

        if (accessToken && isTokenValid(accessToken)) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }

        if (refreshToken && isTokenValid(refreshToken)) {
          try {
            const res: AxiosResponse<IResponseObject<IRefreshTokenResponse>> = await api.post(
              '/auth/me/p/refresh',
              { channel: 'web' },
              { headers: { Authorization: `Bearer ${refreshToken}` } },
            );

            const { accessToken, refreshToken: newRefresh } = res.data.data;

            cookieUtils.setStorage({
              accessToken,
              refreshToken: newRefresh,
            });

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            cookieUtils.deleteStorage();
            handleRedirectLogin(router, pathname);
            return Promise.reject(refreshError);
          }
        }

        cookieUtils.deleteStorage();
        handleRedirectLogin(router, pathname);
        return Promise.reject(error);
      }
      cookieUtils.deleteStorage();
      return Promise.reject(error);
    },
  );

  return <>{children}</>;
};

export default ApiInterceptor;
