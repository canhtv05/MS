import { GraphQLClient } from 'graphql-request';
import { GRAPHQL_ENDPOINT } from '@/configs/endpoints';
import cookieUtils from '@/utils/cookieUtils';
import { toast } from 'sonner';
import i18next from '@/locale/i18n';
import { useAuthStore } from '@/stores/auth';
import { APP_CONFIGS } from '@/configs';

export const getGraphQLClient = () => {
  const token = cookieUtils.getStorage()?.accessToken;

  return new GraphQLClient(GRAPHQL_ENDPOINT, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    responseMiddleware: response => {
      if (response instanceof Response && response.status === 401) {
        toast.error(i18next.t('auth:session_expired.title'), {
          description: i18next.t('auth:session_expired.description'),
        });
        useAuthStore.getState().logout();
        cookieUtils.deleteStorage();
        APP_CONFIGS.QUERY_CLIENT.clear();
      }
    },
  });
};
