import Cookies from 'js-cookie'

const TokenKey = 'UserToken';
const userAuth = {
  getToken() {
    return Cookies.get(TokenKey)
  },
  setToken(token) {
    return Cookies.set(TokenKey, token, {expires: 15})
  },
  removeToken() {
    return Cookies.remove(TokenKey)
  },
};
export {userAuth};

