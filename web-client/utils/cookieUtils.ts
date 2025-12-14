import Cookies from 'js-cookie';

export const APP_KEY = 'MY_MICROSERVICE';

const cookieUtils = {
  setStorage: (objectSet = {}, options = {}) => {
    const data = cookieUtils.getStorage();
    Object.assign(data, objectSet);

    const jsonData = JSON.stringify(data);

    // secure: false for localhost (http), true for production (https)
    //  Cookies.set(APP_KEY, jsonData, { ...options, secure: true, sameSite: 'Strict' });
    Cookies.set(APP_KEY, jsonData, { ...options, secure: false, sameSite: 'Lax' });
  },
  getStorage: () => {
    const data = Cookies.get(APP_KEY);
    return data ? JSON.parse(data) : {};
  },
  deleteStorage: () => {
    Cookies.remove(APP_KEY);
  },
  deleteAccessToken: () => {
    const data = cookieUtils.getStorage();
    delete data.accessToken;
    cookieUtils.setStorage(data);
  },
};

export default cookieUtils;
