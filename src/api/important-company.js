import request from '../utils/request'

export function deleteImportantCompany(id) {
  return request({
    url: '/importantCompany/delete',
    data: {"id": id}
  })
}

export function fetchCompanyTable(pageNumber, pageSize, keyWords) {
  return request({
    url: '/importantCompany/table',
    data: {pageNumber, pageSize, keyWords}
  })
}

export function fetchImportantCompany(id) {
  return request({
    url: '/importantCompany/importantCompany',
    data: {id}
  })
}

export function updateImportantCompany(form) {
  return request({
    url: '/importantCompany/update',
    data: {form}
  })
}

export function createImportantCompany(form) {
  return request({
    url: '/importantCompany/create',
    data: {form}
  })
}



