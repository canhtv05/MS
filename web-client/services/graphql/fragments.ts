export const USER_PROFILE_FRAGMENTS = `
  fragment UserProfileResponseFragment on DetailUserProfileDTO {
    id
    userId
    fullname
    bio
    coverUrl
    avatarUrl
    lastOnlineAt
    followersCount
    followingCount
    createdDate
  }

  fragment UserProfilePrivacyFragment on UserProfilePrivacyDTO {
    id
    profileVisibility
    friendsVisibility
    postsVisibility
  }
`;
