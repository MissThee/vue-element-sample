import request from '../utils/request'

export function updatePassword(form) {
  return request({
    url: '/password/update',
    data: form
  })
}

