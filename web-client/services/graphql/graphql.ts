/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Date: { input: any; output: any };
  DateTime: { input: any; output: any };
};

export type AuthMeDto = {
  channel?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  isGlobal?: Maybe<Scalars['Boolean']['output']>;
  permissions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  roleLabels?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  roles?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  secretKey?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type DetailUserProfileDto = {
  avatarUrl?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  coverUrl?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['DateTime']['output']>;
  followersCount?: Maybe<Scalars['Int']['output']>;
  followingCount?: Maybe<Scalars['Int']['output']>;
  fullname?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  images?: Maybe<GetFileImagesResponse>;
  introduce?: Maybe<UserProfileIntroduceDto>;
  lastOnlineAt?: Maybe<Scalars['DateTime']['output']>;
  privacy?: Maybe<UserProfilePrivacyDto>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type DetailUserProfileDtoImagesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type FileDto = {
  id?: Maybe<Scalars['String']['output']>;
  images?: Maybe<Array<Maybe<ImageDto>>>;
  ownerId?: Maybe<Scalars['String']['output']>;
  resourceType?: Maybe<ResourceType>;
  totalSize?: Maybe<Scalars['Float']['output']>;
  videos?: Maybe<Array<Maybe<VideoDto>>>;
};

export enum Gender {
  GenderFemale = 'GENDER_FEMALE',
  GenderMale = 'GENDER_MALE',
  GenderOther = 'GENDER_OTHER',
  GenderUnspecified = 'GENDER_UNSPECIFIED',
}

export type GetFileImagesResponse = {
  data?: Maybe<Array<Maybe<ImageDto>>>;
  pagination?: Maybe<PageResponse>;
};

export type ImageDto = {
  contentType?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  fileSize?: Maybe<Scalars['Float']['output']>;
  imageUrl?: Maybe<Scalars['String']['output']>;
  originFileName?: Maybe<Scalars['String']['output']>;
  publicId?: Maybe<Scalars['String']['output']>;
  resourceType?: Maybe<ResourceType>;
};

export type InterestDto = {
  color?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type PageResponse = {
  count?: Maybe<Scalars['Int']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
  total?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export enum PrivacyLevel {
  PrivacyLevelCustom = 'PRIVACY_LEVEL_CUSTOM',
  PrivacyLevelFriendsOnly = 'PRIVACY_LEVEL_FRIENDS_ONLY',
  PrivacyLevelPrivate = 'PRIVACY_LEVEL_PRIVATE',
  PrivacyLevelPublic = 'PRIVACY_LEVEL_PUBLIC',
  PrivacyLevelUnspecified = 'PRIVACY_LEVEL_UNSPECIFIED',
}

export type ProfileDto = {
  avatarUrl?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  coverUrl?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['DateTime']['output']>;
  followersCount?: Maybe<Scalars['Int']['output']>;
  followingCount?: Maybe<Scalars['Int']['output']>;
  fullname?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  lastOnlineAt?: Maybe<Scalars['DateTime']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  _empty?: Maybe<Scalars['String']['output']>;
  me?: Maybe<UserProfileDto>;
  userDetail?: Maybe<DetailUserProfileDto>;
};

export type QueryUserDetailArgs = {
  username: Scalars['String']['input'];
};

export enum RelationshipStatus {
  RelationshipStatusCivilPartnership = 'RELATIONSHIP_STATUS_CIVIL_PARTNERSHIP',
  RelationshipStatusDivorced = 'RELATIONSHIP_STATUS_DIVORCED',
  RelationshipStatusEngaged = 'RELATIONSHIP_STATUS_ENGAGED',
  RelationshipStatusHidden = 'RELATIONSHIP_STATUS_HIDDEN',
  RelationshipStatusInARelationship = 'RELATIONSHIP_STATUS_IN_A_RELATIONSHIP',
  RelationshipStatusInLove = 'RELATIONSHIP_STATUS_IN_LOVE',
  RelationshipStatusItsComplicated = 'RELATIONSHIP_STATUS_ITS_COMPLICATED',
  RelationshipStatusMarried = 'RELATIONSHIP_STATUS_MARRIED',
  RelationshipStatusSeparated = 'RELATIONSHIP_STATUS_SEPARATED',
  RelationshipStatusSingle = 'RELATIONSHIP_STATUS_SINGLE',
  RelationshipStatusUnspecified = 'RELATIONSHIP_STATUS_UNSPECIFIED',
  RelationshipStatusWidowed = 'RELATIONSHIP_STATUS_WIDOWED',
}

export enum ResourceType {
  ResourceTypeAvatar = 'RESOURCE_TYPE_AVATAR',
  ResourceTypeComment = 'RESOURCE_TYPE_COMMENT',
  ResourceTypeCover = 'RESOURCE_TYPE_COVER',
  ResourceTypeMessage = 'RESOURCE_TYPE_MESSAGE',
  ResourceTypeOther = 'RESOURCE_TYPE_OTHER',
  ResourceTypePost = 'RESOURCE_TYPE_POST',
  ResourceTypeUnspecified = 'RESOURCE_TYPE_UNSPECIFIED',
}

export type UserProfileDto = {
  auth?: Maybe<AuthMeDto>;
  profile?: Maybe<ProfileDto>;
};

export type UserProfileIntroduceDto = {
  city?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['String']['output']>;
  dob?: Maybe<Scalars['Date']['output']>;
  facebookUrl?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Gender>;
  githubUrl?: Maybe<Scalars['String']['output']>;
  hometown?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  instagramUrl?: Maybe<Scalars['String']['output']>;
  interests?: Maybe<Array<Maybe<InterestDto>>>;
  jobTitle?: Maybe<Scalars['String']['output']>;
  linkedinUrl?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  relationshipStatus?: Maybe<RelationshipStatus>;
  school?: Maybe<Scalars['String']['output']>;
  tiktokUrl?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
  websiteUrl?: Maybe<Scalars['String']['output']>;
  xUrl?: Maybe<Scalars['String']['output']>;
};

export type UserProfilePrivacyDto = {
  friendsVisibility?: Maybe<PrivacyLevel>;
  id?: Maybe<Scalars['String']['output']>;
  postsVisibility?: Maybe<PrivacyLevel>;
  profileVisibility?: Maybe<PrivacyLevel>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type VideoDto = {
  contentType?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  fileSize?: Maybe<Scalars['Float']['output']>;
  originFileName?: Maybe<Scalars['String']['output']>;
  playtimeSeconds?: Maybe<Scalars['Float']['output']>;
  playtimeString?: Maybe<Scalars['String']['output']>;
  previewVttUrl?: Maybe<Scalars['String']['output']>;
  publicId?: Maybe<Scalars['String']['output']>;
  resourceType?: Maybe<ResourceType>;
  thumbnailUrl?: Maybe<Scalars['String']['output']>;
  videoUrl?: Maybe<Scalars['String']['output']>;
};

export type AuthMeFieldsFragment = {
  channel?: string | null;
  email?: string | null;
  isGlobal?: boolean | null;
  permissions?: Array<string | null> | null;
  roleLabels?: Array<string | null> | null;
  roles?: Array<string | null> | null;
  secretKey?: string | null;
  username?: string | null;
} & { ' $fragmentName'?: 'AuthMeFieldsFragment' };

export type ProfileFieldsFragment = {
  id?: string | null;
  userId?: string | null;
  fullname?: string | null;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  bio?: string | null;
  followersCount?: number | null;
  followingCount?: number | null;
  createdDate?: any | null;
  lastOnlineAt?: any | null;
} & { ' $fragmentName'?: 'ProfileFieldsFragment' };

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = {
  me?: {
    auth?: { ' $fragmentRefs'?: { AuthMeFieldsFragment: AuthMeFieldsFragment } } | null;
    profile?: { ' $fragmentRefs'?: { ProfileFieldsFragment: ProfileFieldsFragment } } | null;
  } | null;
};

export type UserProfileIntroduceFieldsFragment = {
  id?: string | null;
  city?: string | null;
  hometown?: string | null;
  jobTitle?: string | null;
  company?: string | null;
  school?: string | null;
  websiteUrl?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  xUrl?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  facebookUrl?: string | null;
  dob?: any | null;
  gender?: Gender | null;
  relationshipStatus?: RelationshipStatus | null;
  phoneNumber?: string | null;
  interests?: Array<{
    id?: string | null;
    title?: string | null;
    color?: string | null;
  } | null> | null;
} & { ' $fragmentName'?: 'UserProfileIntroduceFieldsFragment' };

export type UserProfilePrivacyFieldsFragment = {
  profileVisibility?: PrivacyLevel | null;
  friendsVisibility?: PrivacyLevel | null;
  postsVisibility?: PrivacyLevel | null;
} & { ' $fragmentName'?: 'UserProfilePrivacyFieldsFragment' };

export type UserDetailImagesFieldsFragment = {
  data?: Array<{
    contentType?: string | null;
    imageUrl?: string | null;
    fileSize?: number | null;
    originFileName?: string | null;
    publicId?: string | null;
    createdAt?: any | null;
    resourceType?: ResourceType | null;
  } | null> | null;
} & { ' $fragmentName'?: 'UserDetailImagesFieldsFragment' };

export type DetailUserProfileFieldsFragment = {
  id?: string | null;
  userId?: string | null;
  fullname?: string | null;
  bio?: string | null;
  coverUrl?: string | null;
  avatarUrl?: string | null;
  lastOnlineAt?: any | null;
  followersCount?: number | null;
  followingCount?: number | null;
  createdDate?: any | null;
  introduce?: {
    ' $fragmentRefs'?: { UserProfileIntroduceFieldsFragment: UserProfileIntroduceFieldsFragment };
  } | null;
  privacy?: {
    ' $fragmentRefs'?: { UserProfilePrivacyFieldsFragment: UserProfilePrivacyFieldsFragment };
  } | null;
} & { ' $fragmentName'?: 'DetailUserProfileFieldsFragment' };

export type UserDetailQueryVariables = Exact<{
  username: Scalars['String']['input'];
  size: Scalars['Int']['input'];
}>;

export type UserDetailQuery = {
  userDetail?:
    | ({
        images?: {
          ' $fragmentRefs'?: { UserDetailImagesFieldsFragment: UserDetailImagesFieldsFragment };
        } | null;
      } & {
        ' $fragmentRefs'?: { DetailUserProfileFieldsFragment: DetailUserProfileFieldsFragment };
      })
    | null;
};

export const AuthMeFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AuthMeFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'AuthMeDTO' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'channel' } },
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isGlobal' } },
          { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roleLabels' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'secretKey' } },
          { kind: 'Field', name: { kind: 'Name', value: 'username' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AuthMeFieldsFragment, unknown>;
export const ProfileFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProfileFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ProfileDTO' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullname' } },
          { kind: 'Field', name: { kind: 'Name', value: 'avatarUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'coverUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
          { kind: 'Field', name: { kind: 'Name', value: 'followersCount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'followingCount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastOnlineAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProfileFieldsFragment, unknown>;
export const UserDetailImagesFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserDetailImagesFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GetFileImagesResponse' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'data' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'contentType' } },
                { kind: 'Field', name: { kind: 'Name', value: 'imageUrl' } },
                { kind: 'Field', name: { kind: 'Name', value: 'fileSize' } },
                { kind: 'Field', name: { kind: 'Name', value: 'originFileName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'publicId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'resourceType' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserDetailImagesFieldsFragment, unknown>;
export const UserProfileIntroduceFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserProfileIntroduceFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'UserProfileIntroduceDTO' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'city' } },
          { kind: 'Field', name: { kind: 'Name', value: 'hometown' } },
          { kind: 'Field', name: { kind: 'Name', value: 'jobTitle' } },
          { kind: 'Field', name: { kind: 'Name', value: 'company' } },
          { kind: 'Field', name: { kind: 'Name', value: 'school' } },
          { kind: 'Field', name: { kind: 'Name', value: 'websiteUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'githubUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'linkedinUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'xUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'instagramUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tiktokUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'facebookUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'dob' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gender' } },
          { kind: 'Field', name: { kind: 'Name', value: 'relationshipStatus' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'interests' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserProfileIntroduceFieldsFragment, unknown>;
export const UserProfilePrivacyFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserProfilePrivacyFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserProfilePrivacyDTO' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'profileVisibility' } },
          { kind: 'Field', name: { kind: 'Name', value: 'friendsVisibility' } },
          { kind: 'Field', name: { kind: 'Name', value: 'postsVisibility' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserProfilePrivacyFieldsFragment, unknown>;
export const DetailUserProfileFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DetailUserProfileFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DetailUserProfileDTO' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullname' } },
          { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
          { kind: 'Field', name: { kind: 'Name', value: 'coverUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'avatarUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastOnlineAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'followersCount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'followingCount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdDate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'introduce' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'UserProfileIntroduceFields' },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'privacy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'UserProfilePrivacyFields' },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserProfileIntroduceFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'UserProfileIntroduceDTO' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'city' } },
          { kind: 'Field', name: { kind: 'Name', value: 'hometown' } },
          { kind: 'Field', name: { kind: 'Name', value: 'jobTitle' } },
          { kind: 'Field', name: { kind: 'Name', value: 'company' } },
          { kind: 'Field', name: { kind: 'Name', value: 'school' } },
          { kind: 'Field', name: { kind: 'Name', value: 'websiteUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'githubUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'linkedinUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'xUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'instagramUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tiktokUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'facebookUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'dob' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gender' } },
          { kind: 'Field', name: { kind: 'Name', value: 'relationshipStatus' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'interests' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserProfilePrivacyFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserProfilePrivacyDTO' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'profileVisibility' } },
          { kind: 'Field', name: { kind: 'Name', value: 'friendsVisibility' } },
          { kind: 'Field', name: { kind: 'Name', value: 'postsVisibility' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DetailUserProfileFieldsFragment, unknown>;
export const MeDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Me' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'me' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'auth' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'AuthMeFields' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'profile' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProfileFields' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AuthMeFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'AuthMeDTO' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'channel' } },
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isGlobal' } },
          { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roleLabels' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'secretKey' } },
          { kind: 'Field', name: { kind: 'Name', value: 'username' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProfileFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ProfileDTO' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullname' } },
          { kind: 'Field', name: { kind: 'Name', value: 'avatarUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'coverUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
          { kind: 'Field', name: { kind: 'Name', value: 'followersCount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'followingCount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastOnlineAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const UserDetailDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'UserDetail' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'username' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'size' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'userDetail' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'username' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'username' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'DetailUserProfileFields' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'images' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'size' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'size' } },
                    },
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'UserDetailImagesFields' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserProfileIntroduceFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'UserProfileIntroduceDTO' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'city' } },
          { kind: 'Field', name: { kind: 'Name', value: 'hometown' } },
          { kind: 'Field', name: { kind: 'Name', value: 'jobTitle' } },
          { kind: 'Field', name: { kind: 'Name', value: 'company' } },
          { kind: 'Field', name: { kind: 'Name', value: 'school' } },
          { kind: 'Field', name: { kind: 'Name', value: 'websiteUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'githubUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'linkedinUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'xUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'instagramUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tiktokUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'facebookUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'dob' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gender' } },
          { kind: 'Field', name: { kind: 'Name', value: 'relationshipStatus' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'interests' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserProfilePrivacyFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserProfilePrivacyDTO' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'profileVisibility' } },
          { kind: 'Field', name: { kind: 'Name', value: 'friendsVisibility' } },
          { kind: 'Field', name: { kind: 'Name', value: 'postsVisibility' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DetailUserProfileFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DetailUserProfileDTO' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullname' } },
          { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
          { kind: 'Field', name: { kind: 'Name', value: 'coverUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'avatarUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastOnlineAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'followersCount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'followingCount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdDate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'introduce' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'UserProfileIntroduceFields' },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'privacy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'UserProfilePrivacyFields' },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserDetailImagesFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GetFileImagesResponse' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'data' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'contentType' } },
                { kind: 'Field', name: { kind: 'Name', value: 'imageUrl' } },
                { kind: 'Field', name: { kind: 'Name', value: 'fileSize' } },
                { kind: 'Field', name: { kind: 'Name', value: 'originFileName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'publicId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'resourceType' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserDetailQuery, UserDetailQueryVariables>;
