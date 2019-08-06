import request from 'src/utils/request'

export function background() {
  return request({
    url: '/dashboard/background',
  })
}
