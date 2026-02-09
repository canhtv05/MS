/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  'fragment AuthMeFields on AuthMeDTO {\n  channel\n  email\n  isGlobal\n  permissions\n  roleLabels\n  roles\n  secretKey\n  username\n}\n\nfragment ProfileFields on ProfileDTO {\n  id\n  userId\n  fullname\n  avatarUrl\n  coverUrl\n  bio\n  followersCount\n  followingCount\n  createdDate\n  lastOnlineAt\n}\n\nquery Me {\n  me {\n    auth {\n      ...AuthMeFields\n    }\n    profile {\n      ...ProfileFields\n    }\n  }\n}': typeof types.AuthMeFieldsFragmentDoc;
  'fragment UserProfileIntroduceFields on UserProfileIntroduceDTO {\n  id\n  city\n  hometown\n  jobTitle\n  company\n  school\n  websiteUrl\n  githubUrl\n  linkedinUrl\n  xUrl\n  instagramUrl\n  tiktokUrl\n  facebookUrl\n  dob\n  gender\n  relationshipStatus\n  phoneNumber\n  interests {\n    id\n    code\n    title\n    color\n  }\n}\n\nfragment UserProfilePrivacyFields on UserProfilePrivacyDTO {\n  profileVisibility\n  friendsVisibility\n  postsVisibility\n  introduceVisibility\n  galleryVisibility\n}\n\nfragment UserDetailImagesFields on GetFileImagesResponse {\n  data {\n    contentType\n    imageUrl\n    fileSize\n    originFileName\n    publicId\n    createdAt\n    resourceType\n  }\n}\n\nfragment DetailUserProfileFields on DetailUserProfileDTO {\n  id\n  userId\n  fullname\n  bio\n  coverUrl\n  avatarUrl\n  lastOnlineAt\n  followersCount\n  followingCount\n  createdDate\n  introduce {\n    ...UserProfileIntroduceFields\n  }\n  privacy {\n    ...UserProfilePrivacyFields\n  }\n}\n\nquery UserDetail($username: String!, $size: Int!) {\n  userDetail(username: $username) {\n    ...DetailUserProfileFields\n    images(size: $size) {\n      ...UserDetailImagesFields\n    }\n  }\n}\n\nquery UserProfilePrivacy($username: String!) {\n  userDetail(username: $username) {\n    privacy {\n      ...UserProfilePrivacyFields\n    }\n  }\n}': typeof types.UserProfileIntroduceFieldsFragmentDoc;
};
const documents: Documents = {
  'fragment AuthMeFields on AuthMeDTO {\n  channel\n  email\n  isGlobal\n  permissions\n  roleLabels\n  roles\n  secretKey\n  username\n}\n\nfragment ProfileFields on ProfileDTO {\n  id\n  userId\n  fullname\n  avatarUrl\n  coverUrl\n  bio\n  followersCount\n  followingCount\n  createdDate\n  lastOnlineAt\n}\n\nquery Me {\n  me {\n    auth {\n      ...AuthMeFields\n    }\n    profile {\n      ...ProfileFields\n    }\n  }\n}':
    types.AuthMeFieldsFragmentDoc,
  'fragment UserProfileIntroduceFields on UserProfileIntroduceDTO {\n  id\n  city\n  hometown\n  jobTitle\n  company\n  school\n  websiteUrl\n  githubUrl\n  linkedinUrl\n  xUrl\n  instagramUrl\n  tiktokUrl\n  facebookUrl\n  dob\n  gender\n  relationshipStatus\n  phoneNumber\n  interests {\n    id\n    code\n    title\n    color\n  }\n}\n\nfragment UserProfilePrivacyFields on UserProfilePrivacyDTO {\n  profileVisibility\n  friendsVisibility\n  postsVisibility\n  introduceVisibility\n  galleryVisibility\n}\n\nfragment UserDetailImagesFields on GetFileImagesResponse {\n  data {\n    contentType\n    imageUrl\n    fileSize\n    originFileName\n    publicId\n    createdAt\n    resourceType\n  }\n}\n\nfragment DetailUserProfileFields on DetailUserProfileDTO {\n  id\n  userId\n  fullname\n  bio\n  coverUrl\n  avatarUrl\n  lastOnlineAt\n  followersCount\n  followingCount\n  createdDate\n  introduce {\n    ...UserProfileIntroduceFields\n  }\n  privacy {\n    ...UserProfilePrivacyFields\n  }\n}\n\nquery UserDetail($username: String!, $size: Int!) {\n  userDetail(username: $username) {\n    ...DetailUserProfileFields\n    images(size: $size) {\n      ...UserDetailImagesFields\n    }\n  }\n}\n\nquery UserProfilePrivacy($username: String!) {\n  userDetail(username: $username) {\n    privacy {\n      ...UserProfilePrivacyFields\n    }\n  }\n}':
    types.UserProfileIntroduceFieldsFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'fragment AuthMeFields on AuthMeDTO {\n  channel\n  email\n  isGlobal\n  permissions\n  roleLabels\n  roles\n  secretKey\n  username\n}\n\nfragment ProfileFields on ProfileDTO {\n  id\n  userId\n  fullname\n  avatarUrl\n  coverUrl\n  bio\n  followersCount\n  followingCount\n  createdDate\n  lastOnlineAt\n}\n\nquery Me {\n  me {\n    auth {\n      ...AuthMeFields\n    }\n    profile {\n      ...ProfileFields\n    }\n  }\n}',
): (typeof documents)['fragment AuthMeFields on AuthMeDTO {\n  channel\n  email\n  isGlobal\n  permissions\n  roleLabels\n  roles\n  secretKey\n  username\n}\n\nfragment ProfileFields on ProfileDTO {\n  id\n  userId\n  fullname\n  avatarUrl\n  coverUrl\n  bio\n  followersCount\n  followingCount\n  createdDate\n  lastOnlineAt\n}\n\nquery Me {\n  me {\n    auth {\n      ...AuthMeFields\n    }\n    profile {\n      ...ProfileFields\n    }\n  }\n}'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'fragment UserProfileIntroduceFields on UserProfileIntroduceDTO {\n  id\n  city\n  hometown\n  jobTitle\n  company\n  school\n  websiteUrl\n  githubUrl\n  linkedinUrl\n  xUrl\n  instagramUrl\n  tiktokUrl\n  facebookUrl\n  dob\n  gender\n  relationshipStatus\n  phoneNumber\n  interests {\n    id\n    code\n    title\n    color\n  }\n}\n\nfragment UserProfilePrivacyFields on UserProfilePrivacyDTO {\n  profileVisibility\n  friendsVisibility\n  postsVisibility\n  introduceVisibility\n  galleryVisibility\n}\n\nfragment UserDetailImagesFields on GetFileImagesResponse {\n  data {\n    contentType\n    imageUrl\n    fileSize\n    originFileName\n    publicId\n    createdAt\n    resourceType\n  }\n}\n\nfragment DetailUserProfileFields on DetailUserProfileDTO {\n  id\n  userId\n  fullname\n  bio\n  coverUrl\n  avatarUrl\n  lastOnlineAt\n  followersCount\n  followingCount\n  createdDate\n  introduce {\n    ...UserProfileIntroduceFields\n  }\n  privacy {\n    ...UserProfilePrivacyFields\n  }\n}\n\nquery UserDetail($username: String!, $size: Int!) {\n  userDetail(username: $username) {\n    ...DetailUserProfileFields\n    images(size: $size) {\n      ...UserDetailImagesFields\n    }\n  }\n}\n\nquery UserProfilePrivacy($username: String!) {\n  userDetail(username: $username) {\n    privacy {\n      ...UserProfilePrivacyFields\n    }\n  }\n}',
): (typeof documents)['fragment UserProfileIntroduceFields on UserProfileIntroduceDTO {\n  id\n  city\n  hometown\n  jobTitle\n  company\n  school\n  websiteUrl\n  githubUrl\n  linkedinUrl\n  xUrl\n  instagramUrl\n  tiktokUrl\n  facebookUrl\n  dob\n  gender\n  relationshipStatus\n  phoneNumber\n  interests {\n    id\n    code\n    title\n    color\n  }\n}\n\nfragment UserProfilePrivacyFields on UserProfilePrivacyDTO {\n  profileVisibility\n  friendsVisibility\n  postsVisibility\n  introduceVisibility\n  galleryVisibility\n}\n\nfragment UserDetailImagesFields on GetFileImagesResponse {\n  data {\n    contentType\n    imageUrl\n    fileSize\n    originFileName\n    publicId\n    createdAt\n    resourceType\n  }\n}\n\nfragment DetailUserProfileFields on DetailUserProfileDTO {\n  id\n  userId\n  fullname\n  bio\n  coverUrl\n  avatarUrl\n  lastOnlineAt\n  followersCount\n  followingCount\n  createdDate\n  introduce {\n    ...UserProfileIntroduceFields\n  }\n  privacy {\n    ...UserProfilePrivacyFields\n  }\n}\n\nquery UserDetail($username: String!, $size: Int!) {\n  userDetail(username: $username) {\n    ...DetailUserProfileFields\n    images(size: $size) {\n      ...UserDetailImagesFields\n    }\n  }\n}\n\nquery UserProfilePrivacy($username: String!) {\n  userDetail(username: $username) {\n    privacy {\n      ...UserProfilePrivacyFields\n    }\n  }\n}'];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
