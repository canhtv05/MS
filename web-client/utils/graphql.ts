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

// GraphQL Queries
export const ME_QUERY = `
  query Me {
    me {
      username
      fullName
      email
      isGlobal
      roles
      roleLabels
      permissions
      secretKey
      channel
      dob
      city
      bio
      coverUrl
      avatarUrl
      gender
      phoneNumber
      createdDate
      lastOnlineAt
      tiktokUrl
      fbUrl
      profileVisibility
      friendsVisibility
      postsVisibility
      followersCount
      followingCount
    }
  }
`;
