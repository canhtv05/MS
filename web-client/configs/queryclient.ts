import { logger } from '@/lib/logger';
import cookieUtils from '@/utils/cookieUtils';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0, // Tắt retry để lỗi được throw ngay
      // Chỉ throw error cho server errors (5xx) và network errors
      // 4xx errors (như 404) sẽ để component tự handle
      throwOnError: error => {
        if (error instanceof AxiosError) {
          // Throw cho server errors (500, 502, 503, etc.)
          if (error.response && error.response.status >= 500) {
            return true;
          }
          // Throw cho network errors (không có response)
          if (!error.response) {
            return true;
          }
          // Không throw cho client errors (400, 401, 404, etc.)
          return false;
        }
        // Throw cho các error khác
        return true;
      },
    },
    mutations: {
      retry: 0,
    },
  },
  queryCache: new QueryCache({
    onSuccess(data, query) {
      logger.log('✅ QueryCache Success:', {
        queryKey: query.queryKey,
        hasData: !!data,
      });
    },
    onError(error, query) {
      logger.error('🔴 QueryCache Error:', error);
      logger.log('Query Key:', query.queryKey);

      if (error instanceof AxiosError) {
        if (error.status === 401) {
          logger.log('Handling 401 in QueryCache');
          cookieUtils.clearAuthenticated();
          queryClient.setQueryData(['auth', 'me'], undefined);
          queryClient.setQueryData(['profile', 'me'], undefined);
        } else if (error.status === 500) {
          queryClient.clear();
        }
      }
    },
    onSettled(data, error, query) {
      logger.log('🏁 QueryCache Settled:', {
        queryKey: query.queryKey,
        hasData: !!data,
        hasError: !!error,
        state: query.state,
      });
    },
  }),
  mutationCache: new MutationCache({
    onError(error, _variables, _context, mutation) {
      logger.error('🔴 MutationCache Error:', error);
      logger.log('Mutation Key:', mutation.options.mutationKey);

      if (error instanceof AxiosError) {
        if (error?.response?.status === 401) {
          logger.log('Handling 401 in MutationCache');
          cookieUtils.clearAuthenticated();
          queryClient.setQueryData(['auth', 'me'], undefined);
          // queryClient.setQueryData(['profile', 'me'], undefined);
        }
      }
    },
  }),
});

export default queryClient;
