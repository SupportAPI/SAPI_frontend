import Cookies from 'js-cookie';

export const setToken = (token, options = {}) => {
  Cookies.set('accessToken', token, { expires: 1, ...options });
};

export const getToken = () => {
  return Cookies.get('accessToken');
};

export const removeToken = () => {
  Cookies.remove('accessToken');
};
