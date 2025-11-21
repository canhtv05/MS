import Cookies from 'js-cookie';

export const COOKIE_KEY = 'MY_MICROSERVICE';

const cookieUtils = {
  setStorage: (objectSet = {}, options = {}) => {
    const data = cookieUtils.getStorage();
    Object.assign(data, objectSet);

    const jsonData = JSON.stringify(data);

    Cookies.set(COOKIE_KEY, jsonData, { ...options, secure: true, sameSite: 'Strict' });
  },
  getStorage: () => {
    const data = Cookies.get(COOKIE_KEY);
    return data ? JSON.parse(data) : {};
  },
  deleteStorage: () => {
    Cookies.remove(COOKIE_KEY);
  },
};

export default cookieUtils;
