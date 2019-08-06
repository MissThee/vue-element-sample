import request from '../utils/request'

export function loginByUsername(loginId, password) {
  return request({
    url: '/login/login',
    data: {loginId, password}
  })
}

//登出后台暂无操作  user.js中未使用此api
export function logout() {
  return request({
    url: '/login/logout',
  })
}

export function getUserInfo() {
  return request({
    url: '/index/getUserInfo',
  })
}

export function fetchInfo() {
  return request({
    url: '/login/info',
  })
}

