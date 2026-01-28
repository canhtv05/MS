import { api } from '@/utils/api';
import { GRAPHQL_ENDPOINT } from '@/configs/endpoints';
import { print, DocumentNode } from 'graphql';

export const getGraphQLClient = () => {
  return {
    request: async <T, V = Record<string, unknown>>(
      document: string | DocumentNode,
      variables?: V,
    ): Promise<T> => {
      const queryString = typeof document === 'string' ? document : print(document);
      const response = await api.post<{ data: T }>(GRAPHQL_ENDPOINT, {
        query: queryString,
        variables,
      });
      return response.data.data;
    },
  };
};
