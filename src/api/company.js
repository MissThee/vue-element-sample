import request from '../utils/request'

export function fetchCompanyList( currentUserCompany,limitType ) {
  return request({
    url: '/company/companyList',
    data:{'currentUserCompany':currentUserCompany,'limitType':limitType}
  })
}

export function updateCompany(form) {
  return request({
    url: '/company/update',
    data: {'form': form}
  })
}

export function createCompany(form) {
  return request({
    url: '/company/create',
    data: {'form': form}
  })
}

export function deleteCompany(id) {
  return request({
    url: '/company/delete',
    data: {'id': id}
  })
}
