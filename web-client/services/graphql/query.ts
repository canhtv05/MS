export const ME_QUERY = `
  query Me {
    me {
      auth {
        username
        fullName
        email
        isGlobal
        roles
        roleLabels
        permissions
        secretKey
        channel
      }
      profile {
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
  }
`;
