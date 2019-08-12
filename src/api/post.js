
import request from 'src/utils/request'

export function fetchPostList() {
  return request({
    url: '/post/list',
  })
}

export function updatePost(form) {
  return request({
    url: '/post/update',
    data: {'form': form}
  })
}

export function createPost(form) {
  return request({
    url: '/post/create',
    data: {'form': form}
  })
}

export function deletePost(id) {
  return request({
    url: '/post/delete',
    data: {'id': id}
  })
}
export function fetchPostOne(id) {
  return request({
    url: '/post/one',
    data: {id}
  })
}
