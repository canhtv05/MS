import Cookies from 'js-cookie';

export const APP_KEY = 'LEAF_KEY';

const AUTH_COOKIE_TTL_DAYS = (86400 - 300) / 86400; // ~23h55m

const cookieUtils = {
  setStorage: (objectSet = {}, options: Cookies.CookieAttributes = {}) => {
    const data = cookieUtils.getStorage();
    Object.assign(data, objectSet);

    const jsonData = JSON.stringify(data);

    // secure: false for localhost (http), true for production (https)
    Cookies.set(APP_KEY, jsonData, { ...options, secure: true, sameSite: 'Strict' });
  },
  getStorage: () => {
    const data = Cookies.get(APP_KEY);
    return data ? JSON.parse(data) : {};
  },
  deleteStorage: () => {
    Cookies.remove(APP_KEY);
  },
  getAuthenticated(): boolean {
    return cookieUtils.getStorage().isAuthenticated === true;
  },
  setAuthenticated(value: boolean) {
    if (value) {
      cookieUtils.setStorage({ isAuthenticated: value }, { expires: AUTH_COOKIE_TTL_DAYS });
    } else {
      cookieUtils.deleteStorage();
    }
  },
  clearAuthenticated(): void {
    cookieUtils.deleteStorage();
  },
};

export default cookieUtils;
