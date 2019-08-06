import request from 'src/utils/request'
export function fetchRoleTable() {
  return request({
    url: '/role/table',
  })
}

export function fetchRole(id) {
  return request({
    url: '/role/role',
    data: {'id': id}
  })
}

export function updateRole(data ) {
  return request({
    url: '/role/update',
    data: { 'form':  data  }
  })
}

export function createRole(data ) {
  return request({
    url: '/role/create',
    data: { 'form': data  }
  })
}

export function deleteRole(id) {
  return request({
    url: '/role/delete',
    data: {'id': id}
  })
}

