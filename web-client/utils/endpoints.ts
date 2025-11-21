export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000/api/v1';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/me/p/authenticate`,
    ME: `${BASE_URL}/auth/me`,
  },
};
