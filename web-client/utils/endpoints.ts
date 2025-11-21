export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/me/p/authenticate`,
  },
};
