export const routes = {
  root: '/',
  home: '/home',
  friends: '/friends',
  photos: '/photos',
  newFeed: '/new-feed',
  auth: {
    signIn: '/sign-in',
    signUp: '/sign-up',
    forgotPassword: '/forgot-password',
    verifyEmail: '/verify-email',
  },
  settings: '/settings',
  profile: {
    base: '/home/user',
    byUsername: (username: string) => `/home/user/${username}`,
  },
} as const;

export type Routes = typeof routes;
