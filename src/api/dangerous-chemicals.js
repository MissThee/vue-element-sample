import request from '../utils/request'

export function fetchDangerousChemicalsTable(pageNumber, pageSize, typeId, keyWords) {
  return request({
    url: '/dangerousChemicals/table',
    data: {pageNumber, pageSize, typeId, keyWords}
  })
}

export function fetchDangerousChemicals(id) {
  return request({
    url: '/dangerousChemicals/dangerousChemicals',
    data: {id}
  })
}

export function updateDangerousChemicals(form) {
  return request({
    url: '/dangerousChemicals/update',
    data: {form}
  })
}

export function createDangerousChemicals(form) {
  return request({
    url: '/dangerousChemicals/create',
    data: {form}
  })
}

export function deleteDangerousChemicals(id) {
  return request({
    url: '/dangerousChemicals/delete',
    data: {id}
  })
}

//Type
export function fetchTypeList(needChildren) {
  return request({
    url: '/dangerousChemicalsType/typeList',
    data: {needChildren}
  })
}

export function updateType(form) {
  return request({
    url: '/dangerousChemicalsType/update',
    data: {form}
  })
}

export function createType(form) {
  return request({
    url: '/dangerousChemicalsType/create',
    data: {form}
  })
}

export function deleteType(id) {
  return request({
    url: '/dangerousChemicalsType/delete',
    data: {'id': id}
  })
}
