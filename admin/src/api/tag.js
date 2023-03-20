import request from '@/utils/request'

export function fetchTagList(query) {
  return request({
    url: '/tag/listTag',
    method: 'get',
    params: query
  })
}

export function fetchTag(id) {
  return request({
    url: '/tag/findTag',
    method: 'get',
    params: { id }
  })
}

export function createTag(data) {
  return request({
    url: '/tag/saveTag',
    method: 'post',
    data
  })
}

export function updateTag(data) {
  return request({
    url: '/tag/updateTag',
    method: 'post',
    data
  })
}

export function deleteTag(id) {
  return request({
    url: '/tag/deleteTag',
    method: 'post',
    data: { id } 
  })
}
