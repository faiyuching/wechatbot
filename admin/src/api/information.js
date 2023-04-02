import request from '@/utils/request'

export function fetchInformationList(query) {
  return request({
    url: '/information/listInformation',
    method: 'get',
    params: query
  })
}

export function fetchInformation(id) {
  return request({
    url: '/information/findInformation',
    method: 'get',
    params: { id }
  })
}

export function createInformation(data) {
  return request({
    url: '/information/saveInformation',
    method: 'post',
    data
  })
}

export function updateInformation(data) {
  return request({
    url: '/information/updateInformation',
    method: 'post',
    data
  })
}

export function setFriendWelcome(data) {
  return request({
    url: '/information/setFriendWelcome',
    method: 'post',
    data
  })
}

export function deleteInformation(id) {
  return request({
    url: '/information/deleteInformation',
    method: 'post',
    data: { id } 
  })
}
