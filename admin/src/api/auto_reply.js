import request from '@/utils/request'

export function fetchAutoReplyList(query) {
  return request({
    url: '/auto_reply/listAutoReply',
    method: 'get',
    params: query
  })
}

export function fetchAutoReply(id) {
  return request({
    url: '/auto_reply/findAutoReply',
    method: 'get',
    params: { id }
  })
}

export function createAutoReply(data) {
  return request({
    url: '/auto_reply/saveAutoReply',
    method: 'post',
    data
  })
}

export function updateAutoReply(data) {
  return request({
    url: '/auto_reply/updateAutoReply',
    method: 'post',
    data
  })
}

export function deleteAutoReply(id) {
  return request({
    url: '/auto_reply/deleteAutoReply',
    method: 'post',
    data: { id } 
  })
}
