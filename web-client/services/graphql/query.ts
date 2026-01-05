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
