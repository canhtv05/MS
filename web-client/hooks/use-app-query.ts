import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { CACHE_POLICY } from '@/configs/cache-policy';

type CacheType = keyof typeof CACHE_POLICY;

export function useAppQuery<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
  cacheType: CacheType,
  options: UseQueryOptions<TQueryFnData, TError, TData>,
) {
  return useQuery<TQueryFnData, TError, TData>({
    ...CACHE_POLICY[cacheType],
    ...options,
  });
}
