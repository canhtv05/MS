import { API_ENDPOINTS } from './endpoints';
import { routes } from './routes';
import queryClient from './queryclient';
import { EDITOR_CONFIGS } from './editor';

export const APP_CONFIGS = {
  API_ENDPOINTS,
  ROUTES: routes,
  QUERY_CLIENT: queryClient,
  EDITOR_CONFIGS,
};
