import { api } from '@/utils/api';
import { GRAPHQL_ENDPOINT } from '@/configs/endpoints';
import { print, DocumentNode } from 'graphql';
import { handleMutationError } from './handler-mutation-error';

interface GraphQLResponseError {
  message?: string;
  locations?: Array<{ line: number; column: number }>;
  path?: string[];
  extensions?: Record<string, unknown>;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLResponseError[];
}

export const getGraphQLClient = () => {
  return {
    request: async <T, V = Record<string, unknown>>(
      document: string | DocumentNode,
      variables?: V,
    ): Promise<T> => {
      const queryString = typeof document === 'string' ? document : print(document);
      const response = await api.post<GraphQLResponse<T>>(GRAPHQL_ENDPOINT, {
        query: queryString,
        variables,
      });

      if (
        response.data?.errors &&
        Array.isArray(response.data.errors) &&
        response.data.errors.length > 0
      ) {
        handleMutationError({ errors: response.data.errors }, 'graphql-toast');
      }
      return response.data.data as T;
    },
  };
};

export const isGraphQLError = (error: unknown): error is GraphQLResponseError[] => {
  return Array.isArray(error) && error.length > 0 && 'message' in error[0];
};
