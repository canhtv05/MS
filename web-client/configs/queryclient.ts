import { logger } from '@/lib/logger';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { CACHE_POLICY } from './cache-policy';
import { environment } from '@/environments/environment.dev';

const isDev = environment.production === false;

const shouldRetryQuery = (failureCount: number, error: unknown): boolean => {
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
};

const shouldThrowOnError = (error: unknown): boolean => {
  if (!(error instanceof AxiosError)) return true;
  if (!error.response) return true;

  return error.response.status >= 500;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...CACHE_POLICY.DYNAMIC,
      retry: shouldRetryQuery,
      // Exponential backoff: 1s, 2s, 4s, ... max 30s
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      throwOnError: shouldThrowOnError,
    },
    mutations: {
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onSuccess() {},
    onError(error, query) {
      if (!isDev) return;
      logger.error('🔴 QueryCache Error:', error);
      logger.log('Query Key:', query.queryKey);
    },
    onSettled() {},
  }),
  mutationCache: new MutationCache({
    onError(error, _variables, _context, mutation) {
      if (!isDev) return;
      logger.error('🔴 MutationCache Error:', error);
      logger.log('Mutation Key:', mutation.options.mutationKey);
    },
  }),
});

export default queryClient;
