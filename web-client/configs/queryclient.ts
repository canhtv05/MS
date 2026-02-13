import { logger } from '@/lib/logger';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { CACHE_POLICY } from './cache-policy';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...CACHE_POLICY.DYNAMIC,
      retry: (failureCount, error) => {
        if (failureCount >= 1) {
          return false;
        }

        if (error instanceof AxiosError) {
          if (error.response?.status && error.response.status < 500) {
            return false;
          }
        }

        if (error instanceof Error) {
          if (
            error.message?.includes('GraphQL') ||
            error.message?.includes('UNAUTHENTICATED') ||
            error.message?.includes('UNAUTHORIZED')
          ) {
            return false;
          }
        }

        return true;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff: 1s, 2s, 4s, ... max 30s
      throwOnError: error => {
        if (!(error instanceof AxiosError)) return true;
        if (!error.response) return true;

        return error.response.status >= 500;
      },
    },
    mutations: {
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onSuccess(data, query) {
      logger.log('QueryCache Success:', {
        queryKey: query.queryKey,
        hasData: !!data,
      });
    },
    onError(error, query) {
      logger.error('🔴 QueryCache Error:', error);
      logger.log('Query Key:', query.queryKey);
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
    },
  }),
});

export default queryClient;
