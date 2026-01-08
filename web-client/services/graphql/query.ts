import { USER_PROFILE_FRAGMENTS, FILE_FRAGMENTS } from './fragments';

export const ME_QUERY = `
  query Me {
    me {
      auth {
        username
        email
        isGlobal
        roles
        roleLabels
        permissions
        secretKey
        channel
      }
      profile {
        id
        userId
        fullname
        bio
        coverUrl
        avatarUrl
        createdDate
        lastOnlineAt
        followersCount
        followingCount
      }
    }
  }
`;

export const GET_USER_DETAIL_QUERY = `
  ${USER_PROFILE_FRAGMENTS}
  ${FILE_FRAGMENTS}

  query UserDetail($username: String!, $page: Int, $size: Int) {
    userDetail(username: $username) {
      ...UserProfileResponseFragment
      introduce {
        ...UserProfileIntroduceFragment
      }
      privacy {
        ...UserProfilePrivacyFragment
      }
      images(page: $page, size: $size) {
        ...GetFileImagesResponseFragment
      }
    }
  }
`;
