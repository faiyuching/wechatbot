import request from '@/utils/request'

export function fetchInformationTagList(query) {
  return request({
    url: '/information_tag/listInformationTag',
    method: 'get',
    params: query
  })
}

export function createInformationTag(data) {
  return request({
    url: '/information_tag/saveInformationTag',
    method: 'post',
    data
  })
}

export function deleteInformationTag(id) {
  return request({
    url: '/information_tag/deleteInformationTag',
    method: 'post',
    data: { id } 
  })
}
