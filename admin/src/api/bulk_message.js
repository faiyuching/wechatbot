import request from '@/utils/request'

export function fetchBulkMessageList(query) {
  return request({
    url: '/bulk_message/listBulkMessage',
    method: 'get',
    params: query
  })
}

export function fetchBulkMessage(id) {
  return request({
    url: '/bulk_message/findBulkMessage',
    method: 'get',
    params: { id }
  })
}

export function createBulkMessage(data) {
  return request({
    url: '/bulk_message/saveBulkMessage',
    method: 'post',
    data
  })
}

export function updateBulkMessage(data) {
  return request({
    url: '/bulk_message/updateBulkMessage',
    method: 'post',
    data
  })
}

export function deleteBulkMessage(id) {
  return request({
    url: '/bulk_message/deleteBulkMessage',
    method: 'post',
    data: { id } 
  })
}
