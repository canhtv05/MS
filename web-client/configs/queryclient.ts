import cookieUtils from '@/utils/cookieUtils';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0, // Tắt retry để lỗi được throw ngay
      throwOnError: true, // Đảm bảo lỗi được throw lên
    },
    mutations: {
      retry: 0,
    },
  },
  queryCache: new QueryCache({
    onError(error, query) {
      console.log('🔴 QueryCache Error:', error);
      console.log('Query Key:', query.queryKey);

      if (error instanceof AxiosError) {
        if (error?.response?.status === 401) {
          console.log('Handling 401 in QueryCache');
          cookieUtils.deleteStorage();
          queryClient.setQueryData(['auth', 'me'], undefined);
          queryClient.setQueryData(['profile', 'me'], undefined);
        }
      }
    },
  }),
  mutationCache: new MutationCache({
    onError(error, _variables, _context, mutation) {
      console.log('🔴 MutationCache Error:', error);
      console.log('Mutation Key:', mutation.options.mutationKey);

      if (error instanceof AxiosError) {
        if (error?.response?.status === 401) {
          console.log('Handling 401 in MutationCache');
          cookieUtils.deleteStorage();
          queryClient.setQueryData(['auth', 'me'], undefined);
          queryClient.setQueryData(['profile', 'me'], undefined);
        }
      }
    },
  }),
});

export default queryClient;
