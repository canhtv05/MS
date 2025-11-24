import Cookies from 'js-cookie';

export const APP_KEY = 'MY_MICROSERVICE';

const cookieUtils = {
  setStorage: (objectSet = {}, options = {}) => {
    const data = cookieUtils.getStorage();
    Object.assign(data, objectSet);

    const jsonData = JSON.stringify(data);

    Cookies.set(APP_KEY, jsonData, { ...options, secure: true, sameSite: 'Strict' });
  },
  getStorage: () => {
    const data = Cookies.get(APP_KEY);
    return data ? JSON.parse(data) : {};
  },
  deleteStorage: () => {
    Cookies.remove(APP_KEY);
  },
};

export default cookieUtils;
