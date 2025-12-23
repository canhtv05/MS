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
        xUrl
        instagramUrl
        facebookUrl
        profileVisibility
        friendsVisibility
        postsVisibility
        followersCount
        followingCount
      }
    }
  }
`;
