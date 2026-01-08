import { USER_PROFILE_FRAGMENTS } from './fragments';

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

  query UserDetail($username: String!) {
    userDetail(username: $username) {
      ...UserProfileResponseFragment
      introduce {
        websiteUrl
        jobTitle
        company
        school
        interests {
          id
          title
          color
        }
      }
      privacy {
        ...UserProfilePrivacyFragment
      }
    }
  }
`;
