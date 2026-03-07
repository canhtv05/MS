import { API_ENDPOINTS } from './endpoints';
import { routes } from './routes';
import queryClient from './queryclient';
import { EDITOR_CONFIGS } from './editor';
import { CACHE_KEY } from './cache-key';
import { CACHE_POLICY } from './cache-policy';

export const APP_CONFIGS = {
  API_ENDPOINTS,
  ROUTES: routes,
  QUERY_CLIENT: queryClient,
  CACHE_KEY,
  EDITOR_CONFIGS,
  CACHE_POLICY,
};
