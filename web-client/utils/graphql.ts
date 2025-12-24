import { api } from '@/utils/api';
import { GRAPHQL_ENDPOINT } from '@/configs/endpoints';

export const getGraphQLClient = () => {
  return {
    request: async <T, V = Record<string, unknown>>(
      document: string,
      variables?: V,
    ): Promise<T> => {
      const response = await api.post<{ data: T }>(GRAPHQL_ENDPOINT, {
        query: document,
        variables,
      });
      return response.data.data;
    },
  };
};
