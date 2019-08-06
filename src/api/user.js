import request from 'src/utils/request'

export function fetchUserTable(pageNumber, pageSize, keyWords) {
  return request({
    url: '/user/table',
    data: {pageNumber, pageSize, keyWords}
  })
}

export function fetchUser(id) {
  return request({
    url: '/user/user',
    data: {id}
  })
}

export function updateUser(form) {
  return request({
    url: '/user/update',
    data: {form}
  })
}

export function createUser(form) {
  return request({
    url: '/user/create',
    data: {form}
  })
}

export function deleteUser(id) {
  return request({
    url: '/user/delete',
    data: {id}
  })
}

export function fetchRoles() {
  return request({
    url: '/user/roles',
  })
}

export function uploadAvatar(data) {
  return request({
    url: '/upload/avatar',
    data: {'data': data}
  })
}

export function checkLoginId(loginId) {
  return request({
    url: '/user/checkLoginId',
    data: {'loginId': loginId}
  })
}

export function fetchUserByHeader() {
  return request({
    url: '/user/userByHeader',
  })
}
