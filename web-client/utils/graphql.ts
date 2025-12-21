import { GraphQLClient } from 'graphql-request';
import { GRAPHQL_ENDPOINT } from '@/configs/endpoints';
import cookieUtils from '@/utils/cookieUtils';

export const getGraphQLClient = () => {
  const token = cookieUtils.getStorage()?.accessToken;

  return new GraphQLClient(GRAPHQL_ENDPOINT, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};
