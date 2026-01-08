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

  fragment UserProfileIntroduceFragment on UserProfileIntroduceDTO {
    id
    city
    hometown
    jobTitle
    company
    school
    websiteUrl
    githubUrl
    linkedinUrl
    xUrl
    instagramUrl
    tiktokUrl
    facebookUrl
    dob
    gender
    relationshipStatus
    phoneNumber
    interests {
      id
      title
      color
    }
  }
`;

export const FILE_FRAGMENTS = `
  fragment ImageFragment on ImageDTO {
    contentType
    imageUrl
    fileSize
    originFileName
    publicId
  }

  fragment GetFileImagesResponseFragment on GetFileImagesResponse {
    data {
      ...ImageFragment
    }
    pagination {
      currentPage
      size
      total
      totalPages
      count
    }
  }
`;
